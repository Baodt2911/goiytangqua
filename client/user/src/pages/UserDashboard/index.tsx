import React, { useEffect } from "react";
import { Tabs } from "antd";
import RelationshipManagement from "../../components/RelationshipManagement";
import UserProfile from "../../components/UserProfile";
import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/hook";
import { useNavigate } from "react-router-dom";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated]);
  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "70%",
          margin: "0 auto",
          background: "#fff",
          padding: "50px 50px",
          boxShadow: "0 5px 10px 0 #f5f5f5",
          borderRadius: 10,
        }}
      >
        <Tabs
          tabPosition={"left"}
          size="large"
          animated
          items={[
            {
              label: <p style={{ fontFamily: "Oswald" }}>Thông tin cá nhân</p>,
              key: "profile",
              children: <UserProfile />,
            },
            {
              label: <p style={{ fontFamily: "Oswald" }}>Mối quan hệ</p>,
              key: "relationship",
              children: <RelationshipManagement />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
