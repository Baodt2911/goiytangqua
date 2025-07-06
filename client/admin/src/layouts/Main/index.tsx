import React, { useState } from "react";
import {
  BookOutlined,
  FilterOutlined,
  HomeOutlined,
  ProductOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import mainLogo from "../../assets/logos/logo-light.png";
import subLogo from "../../assets/logos/favicon_io_light/favicon-32x32.png";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { Outlet } from "react-router-dom";
const { Content, Footer, Sider } = Layout;

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
  getItem("Sản phẩm", "product", <ProductOutlined />, [
    getItem("Thêm sản phẩm", "add-product"),
    getItem("Danh sách sản phẩm", "list-product"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Bộ lọc", "filters", <FilterOutlined />),
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ width: 500 }}
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
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Goiytangqua ©{new Date().getFullYear()} created by <b>baodt2911</b>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
