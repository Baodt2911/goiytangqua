import React from "react";
import { Grid, Tabs } from "antd";
import RelationshipManagement from "../../components/RelationshipManagement";
import UserProfile from "../../components/UserProfile";
const { useBreakpoint } = Grid;
const UserDashboard: React.FC = () => {
  const screens = useBreakpoint();
  const isTabletOrMobile = React.useMemo(() => !screens.xl, [screens]);
  return (
    <div
      style={{
        padding: "24px",
        minHeight: isTabletOrMobile ? "auto" : "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          background: "#fff",
          padding: isTabletOrMobile ? "24px 16px" : "50px 50px",
          boxShadow: "0 5px 10px 0 #f5f5f5",
          borderRadius: 10,
        }}
      >
        <Tabs
          tabPosition={isTabletOrMobile ? "top" : "left"}
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
