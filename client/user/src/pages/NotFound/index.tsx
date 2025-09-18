import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const NotFound: React.FC = () => {
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
          padding: "60px 40px",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Result
          status="404"
          title={
            <span style={{ color: "#FF6B81", fontSize: "48px", fontWeight: "bold" }}>
              404
            </span>
          }
          subTitle={
            <div>
              <p style={{ fontSize: "24px", color: "#333", marginBottom: "16px" }}>
                Oops! Trang không tồn tại
              </p>
              <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
                Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
                <br />
                Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
              </p>
            </div>
          }
          extra={
            <div style={{ marginTop: "32px" }}>
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={handleGoHome}
                style={{
                  marginRight: "16px",
                  background: "#FF6B81",
                  borderColor: "#FF6B81",
                  borderRadius: "8px",
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Về trang chủ
              </Button>
              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={handleGoBack}
                style={{
                  borderColor: "#FF6B81",
                  color: "#FF6B81",
                  borderRadius: "8px",
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Quay lại
              </Button>
            </div>
          }
        />
        
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "-50px",
            width: "100px",
            height: "100px",
            background: "rgba(255, 107, 129, 0.1)",
            borderRadius: "50%",
            zIndex: -1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            right: "-30px",
            width: "60px",
            height: "60px",
            background: "rgba(255, 140, 0, 0.1)",
            borderRadius: "50%",
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
};

export default NotFound;
