import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/Auth";
import Login from "./pages/Login";
import MainLayout from "./layouts/Main";
import DashBoard from "./pages/DashBoard";
import Filter from "./pages/Filter";
import Article from "./pages/Article";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="article" element={<Article />} />
          <Route path="filters" element={<Filter />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
