import {
  Layout,
  Row,
  Col,
  Typography,
  Input,
  Button,
  Space,
  Divider,
} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import logoDark from "../../assets/logos/logo-dark.png";
import logoLight from "../../assets/logos/logo-light.png";

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const AppFooter = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <Footer
      style={{
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        padding: "48px 24px 24px",
        marginTop: "40px",
      }}
    >
      {/* Main Footer Content */}
      <Row gutter={[48, 32]} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Logo & Navigation */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <img
                src={theme === "dark" ? logoLight : logoDark}
                alt=""
                width={200}
              />
            </div>

            <Space size="large" wrap>
              <Link
                href="/about"
                style={{
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Giới thiệu
              </Link>
              <Link
                href="/careers"
                style={{
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Tuyển dụng
              </Link>
              <Link
                href="/press"
                style={{
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Báo chí
              </Link>
              <Link
                href="/customer-care"
                style={{
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Chăm sóc khách hàng
              </Link>
              <Link
                href="/services"
                style={{
                  color: theme === "dark" ? "#d1d5db" : "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Dịch vụ
              </Link>
            </Space>
          </div>
        </Col>

        {/* Newsletter Subscription */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <div style={{ textAlign: "right" }}>
            <Title
              level={5}
              style={{
                margin: "0 0 16px 0",
                color: theme === "dark" ? "#f9fafb" : "#111827",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Nhận tin tức mới nhất từ chúng tôi
            </Title>

            <Space.Compact style={{ width: "100%", maxWidth: "400px" }}>
              <Input
                placeholder="Địa chỉ email của bạn..."
                style={{
                  borderRadius: "8px 0 0 8px",
                  border:
                    theme === "dark"
                      ? "1px solid #4b5563"
                      : "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#111827",
                }}
              />
              <Button
                type="primary"
                style={{
                  borderRadius: "0 8px 8px 0",
                  border: "none",
                  height: "40px",
                  fontWeight: "500",
                }}
              >
                Đăng ký
              </Button>
            </Space.Compact>
          </div>
        </Col>
      </Row>

      {/* Divider */}
      <Divider
        style={{
          margin: "32px auto",
          maxWidth: "1200px",
          borderColor: theme === "dark" ? "#4b5563" : "#e5e7eb",
        }}
      />

      {/* Bottom Section - Legal & Copyright */}
      <Row
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          alignItems: "center",
        }}
      >
        <Col xs={24} sm={24} md={12} lg={12}>
          <Space size="large" wrap>
            <Link
              href="/terms"
              style={{
                color: theme === "dark" ? "#9ca3af" : "#6b7280",
                fontSize: "14px",
              }}
            >
              Điều khoản & Điều kiện
            </Link>
            <Link
              href="/privacy"
              style={{
                color: theme === "dark" ? "#9ca3af" : "#6b7280",
                fontSize: "14px",
              }}
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/accessibility"
              style={{
                color: theme === "dark" ? "#9ca3af" : "#6b7280",
                fontSize: "14px",
              }}
            >
              Khả năng tiếp cận
            </Link>
            <Link
              href="/legal"
              style={{
                color: theme === "dark" ? "#9ca3af" : "#6b7280",
                fontSize: "14px",
              }}
            >
              Pháp lý
            </Link>
          </Space>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <div style={{ textAlign: "right" }}>
            <Text
              style={{
                color: theme === "dark" ? "#9ca3af" : "#6b7280",
                fontSize: "14px",
              }}
            >
              Design with Baodt2911 © goiytangqua 2025.
            </Text>
          </div>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;
