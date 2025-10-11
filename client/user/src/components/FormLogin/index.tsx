import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Card,
  Space,
  App,
} from "antd";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../features/auth/auth.slice";
import { loginAsync } from "../../features/auth/auth.service";
import { getCurrentUserAsync } from "../../features/user/user.service";
import { setUser } from "../../features/user/user.slice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
interface FormLoginValues {
  email: string;
  password: string;
}
const URL_API: string = import.meta.env.VITE_URL_API;
const FormLogin: React.FC = () => {
  const { message } = App.useApp();
  const currentPath = useAppSelector(
    (state: RootState) => state.navigation.currentPath
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleFinish = async (values: FormLoginValues) => {
    dispatch(loginStart());
    try {
      const data = await loginAsync(values);

      if (data.status >= 400) {
        dispatch(loginFailure(data.message));
        return message.warning(data.message);
      }
      dispatch(loginSuccess(data.accessToken));
      message.success(data.message);
      const user = await getCurrentUserAsync();
      dispatch(setUser(user));
      navigate("/" + currentPath);
    } catch (error: any) {
      console.error("Error:", error);
      message.error(error.response.data.message);
      dispatch(loginFailure(error.response.data.message));
    }
  };
  useEffect(() => {
    const handleGoogleLoginMessage = async (event: {
      origin: string;
      data: { success: boolean; accessToken: string };
    }) => {
      if (event.origin !== URL_API) return;
      const { success, accessToken } = event.data;
      if (success) {
        message.success("Đăng nhập thành công");
        dispatch(loginSuccess(accessToken));
        const user = await getCurrentUserAsync();
        dispatch(setUser(user));
        navigate("/" + currentPath);
      }
      dispatch(loginFailure("Đăng nhập thất bại"));
    };

    window.addEventListener("message", handleGoogleLoginMessage);

    return () => {
      window.removeEventListener("message", handleGoogleLoginMessage);
    };
  }, []);

  const handleGoogleLogin = async () => {
    dispatch(loginStart());
    const width = 500;
    const height = 500;

    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    window.open(
      `${URL_API}/auth/login/google`,
      "mozillaWindow",
      `popup,width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const handleFacebookLogin = () => {
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
      </Space>
      <Typography.Paragraph style={{ textAlign: "center", marginTop: 20 }}>
        Bạn chưa có tài khoản?
        <a onClick={() => navigate("/auth/register")}>Đăng ký</a>
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <a
            style={{ color: "#DB4437" }}
            onClick={() => navigate("/auth/forgot-password")}
          >
            Quên mật khẩu?
          </a>
        </div>
      </Typography.Paragraph>
    </Card>
  );
};

export default FormLogin;
