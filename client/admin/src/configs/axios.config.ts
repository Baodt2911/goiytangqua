import axios from "axios";
import { store } from "../app/store";
import { refreshToken } from "../features/auth/auth.service";
import { isTokenExpired } from "../utils/token";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
axiosInstance.interceptors.request.use(async (config) => {
  if (config.headers?.["Skip-Auth"] === "true") {
    return config;
  }
  let token = store.getState().auth.accessToken;
  if (token) {
    if (isTokenExpired(token)) {
      token = await refreshToken();
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
