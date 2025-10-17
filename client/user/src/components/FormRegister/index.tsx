import React, { useState, useEffect, useMemo } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  Space,
  App,
  Grid,
} from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { registerAsync, sendOtpAsync } from "../../features/auth/auth.service";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;
interface RegisterFormData {
  email: string;
  password: string;
  otp: string;
}

const FormRegister: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = useMemo(() => !screens.md, [screens]);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = async () => {
    try {
      const email = form.getFieldValue("email");
      if (!email) {
        message.error("Vui lòng nhập email trước khi gửi OTP!");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        message.error("Email không hợp lệ!");
        return;
      }

      setOtpLoading(true);

      const data = await sendOtpAsync(email);
      if (data.status >= 400) {
        return message.warning(data.message);
      }
      message.success(data.message);
      setCountdown(60);
    } catch (error: any) {
      console.error("Send OTP failed:", error.message);
      message.error(error.response.data.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegister = async (values: any) => {
    try {
      setLoading(true);
      const submitData: RegisterFormData = {
        email: values.email,
        password: values.password,
        otp: values.otp,
      };
      const data = await registerAsync(submitData);
      if (data.status >= 400) {
        return message.warning(data.message);
      }
      message.success(data.message);
      navigate("/");
      form.resetFields();
      navigate("/auth/login");
    } catch (error: any) {
      console.log("Register failed:", error.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        width: isMobile ? 320 : 400,
        borderRadius: 10,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        Đăng ký tài khoản
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleRegister}
        style={{ background: "transparent" }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Mã OTP"
          name="otp"
          rules={[
            { required: true, message: "Vui lòng nhập mã OTP!" },
            { len: 6, message: "Mã OTP phải có 6 số!" },
            { pattern: /^\d+$/, message: "Mã OTP chỉ được chứa số!" },
          ]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Nhập mã OTP 6 số"
              prefix={<SafetyOutlined />}
              maxLength={6}
            />
            <Button
              type="primary"
              onClick={handleSendOTP}
              loading={otpLoading}
              disabled={countdown > 0}
              style={{ minWidth: 120 }}
            >
              {countdown > 0 ? `${countdown}s` : "Gửi OTP"}
            </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <Paragraph style={{ textAlign: "center", marginTop: 20 }}>
        Bạn đã có tài khoản?{" "}
        <a onClick={() => navigate("/auth/login")}>Đăng nhập</a>
      </Paragraph>
    </Card>
  );
};

export default FormRegister;
