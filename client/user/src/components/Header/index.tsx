import { useState } from "react";
import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Button,
  Badge,
  List,
  MenuProps,
  Popover,
  Typography,
  Flex,
  Segmented,
} from "antd";
import {
  UserOutlined,
  BellOutlined,
  HeartOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logos/logo-dark.png";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { toggleTheme } from "../../features/theme/theme.slice";
import { RootState } from "../../app/store";
const { Title, Text, Paragraph, Link } = Typography;
const { Header } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
type NotificationItem = {
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
};
const AppHeader: React.FC = () => {
  const [current, setCurrent] = useState("home");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const list = useAppSelector((state: RootState) => state.notifications.list);
  const mode = useAppSelector((state: RootState) => state.theme.mode);
  console.log(mode);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const items: MenuItem[] = [
    {
      label: "Trang chủ",
      key: "home",
    },
    {
      label: "Bài viết",
      key: "article",
    },
    {
      label: "Gợi ý quà tặng",
      key: "suggests",
    },
    {
      label: "Chat bot",
      key: "bot",
    },
  ];
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 10px 0 #e9e9e9",
        background: "#fff",
        padding: "50px 50px",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "0 50px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ height: "50px", marginRight: "12px" }}
          />
        </div>
        {/* Navigation */}
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          style={{
            flex: 1,
            borderBottom: "none",
            fontFamily: "Oswald",
            fontSize: 18,
            padding: "0 50px",
            columnGap: 40,
          }}
          items={items}
        />
      </div>
      {/* Change Theme  */}
      <Flex gap="small" align="flex-start" vertical style={{ marginRight: 50 }}>
        <Segmented
          size={"middle"}
          shape="round"
          options={[
            { value: "light", icon: <SunOutlined /> },
            { value: "dark", icon: <MoonOutlined /> },
          ]}
          onChange={() => dispatch(toggleTheme())}
        />
      </Flex>
      {/* User actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        {isAuthenticated ? (
          <>
            {/* WishList */}
            <Button
              color="danger"
              variant="solid"
              shape="circle"
              icon={<HeartOutlined />}
            />

            {/* Dropdown thông báo */}
            <Popover
              placement="bottomRight"
              trigger={["click"]}
              fresh={true}
              title={
                <Title
                  level={3}
                  style={{ fontFamily: "Oswald", padding: "10px" }}
                >
                  Thông báo
                </Title>
              }
              content={
                <List
                  style={{
                    width: 500,
                    maxHeight: 500,
                    overflowY: "scroll",
                  }}
                  itemLayout="horizontal"
                  dataSource={list}
                  renderItem={(item: NotificationItem) => (
                    <Link
                      href="https://ant.design"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        padding: "15px 25px 15px 15px",
                        opacity: item.read ? 0.7 : 1,
                      }}
                    >
                      <Title style={{ fontFamily: "Oswald" }} level={5}>
                        {item.title}
                      </Title>
                      <Paragraph style={{ fontFamily: "Oswald" }}>
                        {item.message}
                      </Paragraph>
                      <Text
                        style={{ fontSize: 12, fontFamily: "Oswald" }}
                        italic
                        type="secondary"
                      >
                        {new Date(item.createdAt).toLocaleString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Text>
                    </Link>
                  )}
                />
              }
            >
              <Button
                icon={
                  <Badge count={list.length} className="cursor-pointer">
                    <BellOutlined
                      style={{ fontSize: "20px", cursor: "pointer" }}
                    />
                  </Badge>
                }
                type="text"
              />
            </Popover>

            {/* Avatar User */}
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    label: <p>Hồ sơ</p>,
                  },
                  {
                    key: "setting",
                    label: <p>Cài đặt</p>,
                  },
                  {
                    key: "logout",
                    label: <p>Đăng xuất</p>,
                  },
                ],
              }}
              trigger={["hover"]}
              overlayStyle={{ width: 200 }}
            >
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </>
        ) : (
          <>
            <Button
              type="link"
              onClick={() => {
                {
                  navigate("/auth/login");
                }
              }}
              style={{
                fontFamily: "Oswald",
                fontSize: 18,
              }}
            >
              Đăng nhập
            </Button>
            <Button
              type="primary"
              style={{
                padding: "20px 50px",
                fontFamily: "Oswald",
                fontSize: 18,
              }}
              onClick={() => {
                {
                  navigate("/auth/register");
                }
              }}
            >
              Đăng ký
            </Button>
          </>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;
