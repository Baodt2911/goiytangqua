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
import logoLight from "../../assets/logos/logo-light.png";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { toggleTheme } from "../../features/theme/theme.slice";
import { RootState } from "../../app/store";
import { logoutAsync } from "../../features/auth/auth.service";
import { useNavigation } from "../../hooks/useNavigation";
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
  const { currentPath, navigateTo } = useNavigation();
  const dispatch = useAppDispatch();
  const list = useAppSelector((state: RootState) => state.notification.list);
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const theme = useAppSelector((state: RootState) => state.theme.mode);

  const items: MenuItem[] = [
    {
      label: "Trang chủ",
      key: "home",
    },
    {
      label: "Bài viết hay",
      key: "best-articles",
    },
    {
      label: "Gợi ý quà tặng",
      key: "suggest-gift",
    },
    {
      label: "Chat bot",
      key: "chat-bot",
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    navigateTo(e.key);
  };

  const isDark = theme === "dark";

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        background: isDark ? "#1f2937" : "#ffffff",
        padding: window.innerWidth <= 768 ? "12px 20px" : "0px 70px",
        borderBottom: isDark ? "1px solid #374151" : "1px solid #f0f0f0",
        transition: "all 0.3s ease",
        minHeight: "auto",
        height: "auto",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: window.innerWidth <= 768 ? "0 12px" : "0 20px",
          flexWrap: "wrap",
          gap: window.innerWidth <= 768 ? "12px" : "16px",
        }}
      >
        {/* Logo */}
        <a
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
          onClick={() => navigateTo("/")}
        >
          <img
            src={isDark ? logoLight : logo}
            alt="Logo"
            style={{
              height: window.innerWidth <= 768 ? "32px" : "40px",
              marginRight: "12px",
            }}
          />
        </a>
        {/* Navigation */}
        <Menu
          onClick={onClick}
          selectedKeys={[currentPath]}
          mode="horizontal"
          style={{
            flex: 1,
            borderBottom: "none",
            fontFamily: "Oswald",
            fontSize: window.innerWidth <= 768 ? "14px" : "16px",
            padding: window.innerWidth <= 768 ? "0 12px" : "0 20px",
            columnGap: window.innerWidth <= 768 ? "16px" : "24px",
            background: "transparent",
            minWidth: "fit-content",
          }}
          theme={isDark ? "dark" : "light"}
          items={items}
        />
      </div>

      {/* Change Theme  */}
      <Flex
        gap="small"
        align="center"
        style={{
          marginRight: window.innerWidth <= 768 ? "20px" : "35px",
        }}
      >
        <Segmented
          size={window.innerWidth <= 768 ? "small" : "middle"}
          shape="round"
          options={[
            { value: "light", icon: <SunOutlined /> },
            { value: "dark", icon: <MoonOutlined /> },
          ]}
          value={theme}
          onChange={() => dispatch(toggleTheme())}
        />
      </Flex>

      {/* User actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: window.innerWidth <= 768 ? "12px" : "16px",
          flexWrap: "wrap",
        }}
      >
        {isAuthenticated ? (
          <Flex gap={30}>
            {/* WishList */}
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<HeartOutlined />}
              size={window.innerWidth <= 768 ? "small" : "middle"}
            />

            {/* Dropdown thông báo */}
            <Popover
              placement="bottomRight"
              trigger={["click"]}
              fresh={true}
              title={
                <Title
                  level={4}
                  style={{ fontFamily: "Oswald", padding: "8px", margin: 0 }}
                >
                  Thông báo
                </Title>
              }
              content={
                <List
                  style={{
                    width: window.innerWidth <= 768 ? "300px" : "400px",
                    maxHeight: "400px",
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
                        padding: "12px 20px 12px 12px",
                        opacity: item.read ? 0.7 : 1,
                      }}
                    >
                      <Title
                        style={{ fontFamily: "Oswald", margin: 0 }}
                        level={5}
                      >
                        {item.title}
                      </Title>
                      <Paragraph
                        style={{ fontFamily: "Oswald", margin: "8px 0" }}
                      >
                        {item.message}
                      </Paragraph>
                      <Text
                        style={{ fontSize: "12px", fontFamily: "Oswald" }}
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
                      style={{
                        fontSize: window.innerWidth <= 768 ? "16px" : "18px",
                        cursor: "pointer",
                        color: isDark ? "#fff" : "#333",
                      }}
                    />
                  </Badge>
                }
                type="text"
                size={window.innerWidth <= 768 ? "small" : "middle"}
              />
            </Popover>

            {/* Avatar User */}
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    label: (
                      <span
                        onClick={() => {
                          navigateTo("/user-dashboard");
                        }}
                      >
                        Hồ sơ
                      </span>
                    ),
                  },
                  {
                    key: "setting",
                    label: (
                      <a
                        onClick={() => {
                          navigateTo("/setting");
                        }}
                      >
                        Cài đặt
                      </a>
                    ),
                  },
                  {
                    key: "logout",
                    label: (
                      <span
                        style={{ color: "red" }}
                        onClick={() => logoutAsync()}
                      >
                        Đăng xuất
                      </span>
                    ),
                  },
                ],
              }}
              trigger={["hover"]}
              placement="bottom"
              arrow={{ pointAtCenter: true }}
            >
              <Avatar
                size={window.innerWidth <= 768 ? "small" : "default"}
                icon={<UserOutlined />}
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </Flex>
        ) : (
          <>
            <Button
              type="default"
              onClick={() => {
                navigateTo("/auth/login");
              }}
              style={{
                fontFamily: "Oswald",
                fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                height: window.innerWidth <= 768 ? "32px" : "36px",
                padding: window.innerWidth <= 768 ? "0 12px" : "0 16px",
              }}
            >
              Đăng nhập
            </Button>
            <Button
              type="primary"
              style={{
                padding: window.innerWidth <= 768 ? "0 16px" : "0 20px",
                fontFamily: "Oswald",
                fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                height: window.innerWidth <= 768 ? "32px" : "36px",
              }}
              onClick={() => {
                navigateTo("/auth/register");
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
