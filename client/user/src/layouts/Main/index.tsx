import { Outlet } from "react-router-dom";
import AppHeader from "../../components/Header";
import { Layout } from "antd";
import AppFooter from "../../components/Footer";
import React from "react";

const MainLayout: React.FC = () => {
  return (
    <Layout
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <AppHeader />
      <Outlet />
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;
