import React, { useMemo } from "react";
import { Button, Grid, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
const { useBreakpoint } = Grid;

const NotFound: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = useMemo(() => !screens.md, [screens]);

  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FF6B81 0%, #FF8C00 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: isMobile ? "28px 20px" : "60px 40px",
          maxWidth: isMobile ? "92%" : "600px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Result
          status="404"
          title={
            <span
              style={{
                color: "#FF6B81",
                fontSize: isMobile ? "40px" : "48px",
                fontWeight: "bold",
              }}
            >
              404
            </span>
          }
          subTitle={
            <div>
              <p
                style={{
                  fontSize: isMobile ? "18px" : "24px",
                  color: "#333",
                  marginBottom: isMobile ? "12px" : "16px",
                }}
              >
                Oops! Trang không tồn tại
              </p>
              <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
                Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời
                không khả dụng.
                <br />
                Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
              </p>
            </div>
          }
          extra={
            <div
              style={{
                marginTop: isMobile ? "20px" : "32px",
                display: "flex",
                gap: isMobile ? "8px" : "16px",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                type="primary"
                size={isMobile ? "middle" : "large"}
                icon={<HomeOutlined />}
                onClick={handleGoHome}
                style={{
                  background: "#FF6B81",
                  borderColor: "#FF6B81",
                  borderRadius: "8px",
                  height: isMobile ? "44px" : "48px",
                  fontSize: isMobile ? "15px" : "16px",
                  fontWeight: "500",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Về trang chủ
              </Button>
              <Button
                size={isMobile ? "middle" : "large"}
                icon={<ArrowLeftOutlined />}
                onClick={handleGoBack}
                style={{
                  borderColor: "#FF6B81",
                  color: "#FF6B81",
                  borderRadius: "8px",
                  height: isMobile ? "44px" : "48px",
                  fontSize: isMobile ? "15px" : "16px",
                  fontWeight: "500",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Quay lại
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default NotFound;
