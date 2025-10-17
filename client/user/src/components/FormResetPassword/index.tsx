import React, { useEffect, useMemo, useState } from "react";
import { Form, Input, Button, Typography, Card, App, Grid } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordAsync } from "../../features/auth/auth.service";
const { useBreakpoint } = Grid;
interface FormResetPasswordValues {
  newPassword: string;
  confirmPassword: string;
}

const FormResetPassword: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = useMemo(() => !screens.md, [screens]);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    console.log(tokenFromUrl);
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      // Lưu token vào localStorage để sử dụng trong request
      localStorage.setItem("resetToken", tokenFromUrl);
    } else {
      message.error("Token không hợp lệ hoặc đã hết hạn");
      navigate("/auth/login");
    }
  }, [searchParams, navigate, message]);

  const handleFinish = async (values: FormResetPasswordValues) => {
    try {
      setIsLoading(true);
      const data = await resetPasswordAsync(values.newPassword);

      if (data.status >= 400) {
        return message.error(data.message);
      }

      message.success(data.message);
      // Xóa token khỏi localStorage
      localStorage.removeItem("resetToken");
      navigate("/auth/login");
    } catch (error: any) {
      console.error("Error:", error);
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

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
        Đặt lại mật khẩu
      </Typography.Title>
      <Typography.Paragraph style={{ textAlign: "center", marginBottom: 20 }}>
        Nhập mật khẩu mới của bạn
      </Typography.Paragraph>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        style={{ background: "transparent" }}
      >
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ marginTop: 20 }}
            loading={isLoading}
          >
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
      <Typography.Paragraph style={{ textAlign: "center", marginTop: 20 }}>
        Nhớ mật khẩu? <a onClick={() => navigate("/auth/login")}>Đăng nhập</a>
      </Typography.Paragraph>
    </Card>
  );
};

export default FormResetPassword;
