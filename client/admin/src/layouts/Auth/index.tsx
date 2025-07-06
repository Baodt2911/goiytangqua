import { Outlet } from "react-router-dom";
import logo from "../../assets/logos/logo-dark.png";
import { Layout } from "antd";
import React from "react";
const AuthLayout: React.FC = () => {
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
