import { Outlet } from "react-router-dom";
import AppHeader from "../../components/Header";
import { Layout } from "antd";
import React from "react";
import { Content } from "antd/es/layout/layout";

const ChatLayout: React.FC = () => {
  return (
    <Layout
      style={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <AppHeader />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default ChatLayout;
