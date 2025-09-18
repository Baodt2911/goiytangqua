import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hook";

const GuestRoute: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default GuestRoute;
