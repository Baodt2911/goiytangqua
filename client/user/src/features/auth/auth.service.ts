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
export const sendOtpAsync = async (email: string) => {
  const res = await axios.post(`${import.meta.env.VITE_URL_API}/otp/send-otp`, {
    email,
  });
  return res.data;
};
export const loginAsync = async (data: { email: string; password: string }) => {
  const res = await axios.post(
    `${import.meta.env.VITE_URL_API}/auth/login`,
    data,
    { withCredentials: true }
  );
  return res.data;
};
export const registerAsync = async (data: {
  email: string;
  password: string;
  otp: string;
}) => {
  const res = await axios.post(
    `${import.meta.env.VITE_URL_API}/auth/register`,
    data
  );
  return res.data;
};
export const logoutAsync = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_URL_API}/auth/logout`,
      {},
      { withCredentials: true }
    );
    store.dispatch(logout());
    window.location.reload();
  } catch (error) {
    console.error("Failed logout: ", error);
  }
};

export const requestResetPasswordAsync = async (email: string) => {
  const res = await axios.post(
    `${import.meta.env.VITE_URL_API}/user/request-reset-password`,
    { email }
  );
  return res.data;
};

export const resetPasswordAsync = async (newPassword: string) => {
  const resetToken = localStorage.getItem("resetToken");
  const res = await axios.post(
    `${import.meta.env.VITE_URL_API}/user/reset-password`,
    { newPassword },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    }
  );
  return res.data;
};
