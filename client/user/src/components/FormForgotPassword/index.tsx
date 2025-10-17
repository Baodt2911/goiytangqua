import React, { useMemo, useState } from "react";
import { Form, Input, Button, Typography, Card, App, Grid } from "antd";
import { useNavigate } from "react-router-dom";
import { requestResetPasswordAsync } from "../../features/auth/auth.service";
const { useBreakpoint } = Grid;
interface FormForgotPasswordValues {
  email: string;
}

const FormForgotPassword: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = useMemo(() => !screens.md, [screens]);
  const { message } = App.useApp();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFinish = async (values: FormForgotPasswordValues) => {
    try {
      setIsLoading(true);
      const data = await requestResetPasswordAsync(values.email);

      if (data.status >= 400) {
        return message.error(data.message);
      }

      message.success(data.message);
      navigate("/auth/login");
    } catch (error: any) {
      console.error("Error:", error);
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
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
      <Typography.Title
        level={3}
        style={{ textAlign: "center", marginBottom: 20 }}
      >
        Quên mật khẩu
      </Typography.Title>
      <Typography.Paragraph style={{ textAlign: "center", marginBottom: 20 }}>
        Nhập email của bạn để nhận liên kết đặt lại mật khẩu
      </Typography.Paragraph>
      <Form
        layout="vertical"
        onFinish={handleFinish}
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
          <Input placeholder="Nhập email của bạn" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ marginTop: 20 }}
            loading={isLoading}
          >
            Gửi liên kết đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
      <Typography.Paragraph style={{ textAlign: "center", marginTop: 20 }}>
        Nhớ mật khẩu? <a onClick={() => navigate("/auth/login")}>Đăng nhập</a>
      </Typography.Paragraph>
    </Card>
  );
};

export default FormForgotPassword;
