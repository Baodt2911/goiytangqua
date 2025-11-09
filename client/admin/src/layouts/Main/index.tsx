import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  FilterOutlined,
  HomeOutlined,
  ProductOutlined,
  LoginOutlined,
  OpenAIOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import mainLogo from "../../assets/logos/logo-light.png";
import subLogo from "../../assets/logos/favicon_io_light/favicon-32x32.png";
import type { MenuProps } from "antd";
import { Button, Layout, Menu, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logoutAsync } from "../../features/auth/auth.service";
const { Content, Footer, Sider } = Layout;
const { Text } = Typography;
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Bảng điều khiển", "dashboard", <HomeOutlined />),
  getItem("Bài viết", "article", <BookOutlined />, [
    getItem("Viết bài", "writing"),
    getItem("Danh sách bài viết", "list-article"),
  ]),
  getItem("Sản phẩm", "product", <ProductOutlined />),
  getItem("Bộ lọc", "filter", <FilterOutlined />),
  getItem("AI Prompt", "ai-prompt", <OpenAIOutlined />),
  getItem("Logs", "logs", <FileSearchOutlined />),
];

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setSelectedKey(path || "dashboard");
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={siderStyle}
      >
        <div
          style={{
            margin: "20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={collapsed ? subLogo : mainLogo}
            alt=""
            width={collapsed ? 32 : 150}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={items}
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            switch (key) {
              case "dashboard":
                setSelectedKey(key);
                navigate("/dashboard");
                break;
              case "writing":
                setSelectedKey(key);
                navigate("/article/writing");
                break;
              case "list-article":
                setSelectedKey(key);
                navigate("/article/list-article");
                break;
              case "filter":
                setSelectedKey(key);
                navigate("filter");
                break;
              case "product":
                setSelectedKey(key);
                navigate("product");
                break;
              case "ai-prompt":
                setSelectedKey(key);
                navigate("ai-prompt");
                break;
              case "logs":
                setSelectedKey(key);
                navigate("logs");
                break;
              default:
                break;
            }
          }}
        />
        <Button
          type="text"
          style={{
            position: "absolute",
            bottom: 70,
            width: "100%",
            textAlign: "center",
          }}
          onClick={() => logoutAsync()}
        >
          {collapsed ? (
            <LoginOutlined style={{ color: "white" }} />
          ) : (
            <Text style={{ fontSize: 16, color: "red" }}>Đăng xuất</Text>
          )}
        </Button>
      </Sider>
      <Layout style={{ background: "#fff" }}>
        <Content style={{ margin: "0 16px", background: "#fff", padding: 25 }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center", background: "#fff" }}>
          Goiytangqua ©{new Date().getFullYear()} created by <b>baodt2911</b>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
