import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/Auth";
import Login from "./pages/Login";
import MainLayout from "./layouts/Main";
import DashBoardPage from "./pages/DashBoard";
import FilterPage from "./pages/Filter";
import WritingPage from "./pages/Writing";
import PostsPage from "./pages/Posts";
import ProductPage from "./pages/Product";
import AIPromptPage from "./pages/AIPrompt";
import { useEffect } from "react";
import { isTokenExpired } from "./utils/token";
import { refreshToken } from "./features/auth/auth.service";
import { loginSuccess, logout } from "./features/auth/auth.slice";
import { useAppDispatch } from "./app/hook";
function App() {
  const dispatch = useAppDispatch();
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
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<DashBoardPage />} />
          <Route path="article">
            <Route path="writing" element={<WritingPage />} />
            <Route path="list-article" element={<PostsPage />} />
          </Route>
          <Route path="filter" element={<FilterPage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="ai-prompt" element={<AIPromptPage />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
