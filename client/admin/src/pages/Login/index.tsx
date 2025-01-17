import React from "react";
import { Layout } from "antd";
import FormLogin from "../../components/FormLogin";
const { Content } = Layout;
const Login: React.FC = () => {
  return (
    <Content
      style={{
        marginTop: 100,
      }}
    >
      <FormLogin />
    </Content>
  );
};

export default Login;
