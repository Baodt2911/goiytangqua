import React from "react";
import { Layout } from "antd";
import FormRegister from "../../components/FormRegister";
const { Content } = Layout;
const Register: React.FC = () => {
  return (
    <Content
      style={{
        marginTop: 50,
      }}
    >
      <FormRegister />
    </Content>
  );
};

export default Register;
