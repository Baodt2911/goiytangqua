import { Layout } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const { Footer } = Layout;

const AppFooter = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <Footer
      style={{
        background: theme === "dark" ? "#181818" : "#fff",
        color: theme === "dark" ? "#ccc" : "#333",
        padding: "50px 20px",
        textAlign: "center",
        borderTop: "1px solid rgba(0, 0, 0, 0.1)",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        {/* Cột 1: Logo & Slogan */}
        <div style={{ flex: 1, minWidth: "300px", textAlign: "left" }}>
          <h2
            style={{
              color: theme === "dark" ? "#fff" : "#333",
              fontFamily: "cursive",
              marginBottom: "10px",
            }}
          >
            🎁 Gợi Ý Tặng Quà
          </h2>
          <p style={{ fontSize: "14px", opacity: 0.8, lineHeight: "1.6" }}>
            Chúng tôi giúp bạn tìm kiếm món quà ý nghĩa cho người thân yêu.
          </p>
        </div>

        {/* Cột 2: Menu Điều Hướng */}
        <div style={{ flex: 1, minWidth: "200px", textAlign: "center" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Menu
          </h3>
          <p>
            <a
              href="/about"
              style={{ color: theme === "dark" ? "#ccc" : "#333" }}
            >
              Giới thiệu
            </a>
          </p>
          <p>
            <a
              href="/privacy"
              style={{ color: theme === "dark" ? "#ccc" : "#333" }}
            >
              Chính sách bảo mật
            </a>
          </p>
          <p>
            <a
              href="/terms"
              style={{ color: theme === "dark" ? "#ccc" : "#333" }}
            >
              Điều khoản sử dụng
            </a>
          </p>
          <p>
            <a
              href="/contact"
              style={{ color: theme === "dark" ? "#ccc" : "#333" }}
            >
              Liên hệ
            </a>
          </p>
        </div>

        {/* Cột 3: Liên hệ & Mạng Xã Hội */}
        <div style={{ flex: 1, minWidth: "250px", textAlign: "right" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Liên hệ
          </h3>
          <p>
            <MailOutlined /> contact@goiytangqua.com
          </p>
          <p>
            <PhoneOutlined /> 0123 456 789
          </p>
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
            }}
          >
            <a
              href="https://facebook.com"
              target="_blank"
              style={{ fontSize: "20px", color: "#1877f2" }}
            >
              <FacebookOutlined />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              style={{ fontSize: "20px", color: "#E1306C" }}
            >
              <InstagramOutlined />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              style={{ fontSize: "20px", color: "#1DA1F2" }}
            >
              <TwitterOutlined />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ marginTop: "30px", fontSize: "14px", opacity: 0.7 }}>
        © {new Date().getFullYear()} Gợi Ý Tặng Quà - All rights reserved.
      </div>
    </Footer>
  );
};

export default AppFooter;
