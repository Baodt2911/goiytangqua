import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/logos/logo-dark.png";
import { Layout } from "antd";
import React, { useEffect } from "react";
import { useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
const AuthLayout: React.FC = () => {
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <Layout
      style={{
        width: "100%",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={logo} alt="" width={250} style={{ marginTop: 50 }} />
      <Outlet />
    </Layout>
  );
};

export default AuthLayout;
