import axios from "axios";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
export default axiosInstance;
