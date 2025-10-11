import React from "react";
import { Layout } from "antd";
import FormForgotPassword from "../../components/FormForgotPassword";

const { Content } = Layout;

const ForgotPassword: React.FC = () => {
  return (
    <Content
      style={{
        marginTop: 50,
      }}
    >
      <FormForgotPassword />
    </Content>
  );
};

export default ForgotPassword;
