import React from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { useAppDispatch } from "../../app/hook";
import axiosInstance from "../../configs/axios.config";
import { useNavigate } from "react-router-dom";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../features/auth/auth.slice";
type FormLoginValues = {
  email: string;
  password: string;
};
const FormLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleFinish = async (values: FormLoginValues) => {
    dispatch(loginStart());
    axiosInstance
      .post(
        "/auth/login",
        {
          email: values.email,
          password: values.password,
        },
        { headers: { "Skip-Auth": "true" } }
      )
      .then((res) => {
        const { data } = res;
        if (!res.statusText) {
          return message.error(data.message);
        }
        dispatch(loginSuccess(data.accessToken));
        message.success(data.message);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error(error.response.data.message);
        dispatch(loginFailure(error.response.data.message));
      });
  };
  return (
    <Card
      style={{
        width: 400,
        borderRadius: 10,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography.Title
        level={3}
        style={{ textAlign: "center", marginBottom: 20 }}
      >
        Đăng nhập
      </Typography.Title>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        style={{ background: "transparent" }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ marginTop: 20 }}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormLogin;
