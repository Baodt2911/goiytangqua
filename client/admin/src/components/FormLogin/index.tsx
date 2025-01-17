import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Divider,
  Card,
  Space,
} from "antd";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import axiosInstance from "../../configs/axios.config";
interface FormLoginValues {
  email: string;
  password: string;
}

const FormLogin: React.FC = () => {
  const handleFinish = async (values: FormLoginValues) => {
    axiosInstance
      .post("/auth/login", {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        const { data } = res;
        if (!res.statusText) {
          return message.error(data.message);
        }
        message.success(data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error(error.response.data.message);
      });
  };
  const handleLogout = async () => {
    axiosInstance
      .post("/auth/logout")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    const handleGoogleLoginMessage = (event: {
      origin: string;
      data: { success: string };
    }) => {
      if (event.origin !== import.meta.env.VITE_URL_API) return;

      const { success } = event.data;
      if (success) {
        console.log("Đăng nhập thành công:");
      }
    };

    window.addEventListener("message", handleGoogleLoginMessage);

    return () => {
      window.removeEventListener("message", handleGoogleLoginMessage);
    };
  }, []);

  const handleGoogleLogin = async () => {
    const width = 500;
    const height = 500;

    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    window.open(
      "http://localhost:3000/auth/login/google",
      "mozillaWindow",
      `popup,width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const handleFacebookLogin = () => {
    axiosInstance
      .get("/auth/me")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    message.info("Facebook login is not implemented yet!");
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
      <Divider>Hoặc</Divider>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          type="default"
          icon={<GoogleOutlined />}
          block
          onClick={handleGoogleLogin}
          style={{
            backgroundColor: "#DB4437",
            color: "#fff",
            border: "none",
          }}
        >
          Đăng nhập với Google
        </Button>
        <Button
          type="default"
          icon={<FacebookOutlined />}
          block
          onClick={handleFacebookLogin}
          style={{
            backgroundColor: "#3b5998",
            color: "#fff",
            border: "none",
            marginTop: 5,
          }}
        >
          Đăng nhập với Facebook
        </Button>
        <Button
          type="default"
          icon={<FacebookOutlined />}
          block
          onClick={handleLogout}
          style={{
            backgroundColor: "red",
            color: "#fff",
            border: "none",
            marginTop: 5,
          }}
        >
          Đăng xuất
        </Button>
      </Space>
      <Typography.Paragraph style={{ textAlign: "center", marginTop: 20 }}>
        Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
      </Typography.Paragraph>
    </Card>
  );
};

export default FormLogin;
