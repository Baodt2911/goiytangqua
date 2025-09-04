import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import AuthLayout from "./layouts/Auth";
import MainLayout from "./layouts/Main";
import SuggestGiftPage from "./pages/SuggestGift";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hook";
import { loginSuccess, logout } from "./features/auth/auth.slice";
import { isTokenExpired } from "./utils/token";
import { refreshToken } from "./features/auth/auth.service";
import { ConfigProvider, theme } from "antd";
import UserDashboardPage from "./pages/UserDashboard";
import { setUser } from "./features/user/user.slice";
import { getCurrentUserAsync } from "./features/user/user.service";
import ChatBotPage from "./pages/Chatbot";
import ChatLayout from "./layouts/Chat";
import HomePage from "./pages/Home";
import ArticlePage from "./pages/Article";
import RegisterPage from "./pages/Register";

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
          const user = await getCurrentUserAsync();
          dispatch(setUser(user));
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
            <Route path="" element={<HomePage />} />
            <Route path="article/:slug" element={<ArticlePage />} />
            <Route path="suggest-gift" element={<SuggestGiftPage />} />
            <Route path="user-dashboard" element={<UserDashboardPage />} />
          </Route>
          <Route path="/" element={<ChatLayout />}>
            <Route path="chat-bot" element={<ChatBotPage />} />
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
