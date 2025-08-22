import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AuthLayout from "./layouts/Auth";
import MainLayout from "./layouts/Main";
import Home from "./pages/Home";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hook";
import { loginSuccess, logout } from "./features/auth/auth.slice";
import { isTokenExpired } from "./utils/token";
import { refreshToken } from "./features/auth/auth.service";
import { ConfigProvider, theme } from "antd";
function App() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.mode);
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        if (isTokenExpired(token)) {
          await refreshToken();
        } else {
          dispatch(loginSuccess(token));
        }
      } else {
        dispatch(logout());
      }
    };
    checkAuth();
  }, []);
  return (
    <ConfigProvider
      theme={{
        algorithm:
          isDarkMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#FF6B81", // Màu chính (nút, liên kết)
          colorInfo: "#FF8C00", // Màu phụ
          colorSuccess: "#28C76F", // Màu xanh lá (thành công)
          colorWarning: "#FFC107", // Màu vàng cảnh báo
          colorError: "#FF4757", // Màu đỏ lỗi
          colorBgBase: "#fff", // Màu nền tổng thể
          colorTextBase: "#333333", // Màu chữ chính
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="" element={<Home />} />
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
