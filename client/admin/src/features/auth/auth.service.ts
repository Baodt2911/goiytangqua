import axios from "axios";
import { store } from "../../app/store";
import { loginSuccess, logout } from "./auth.slice";
export const refreshToken = async () => {
  try {
    const {
      data: { accessToken },
    } = await axios.post(
      `${import.meta.env.VITE_URL_API}/token/refresh-token`,
      {},
      { withCredentials: true }
    );
    if (accessToken) {
      store.dispatch(loginSuccess(accessToken));
    } else {
      store.dispatch(logout());
    }
    return accessToken;
  } catch {
    store.dispatch(logout());
    return null;
  }
};
