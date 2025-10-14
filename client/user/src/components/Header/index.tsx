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
  Drawer,
} from "antd";
import {
  UserOutlined,
  BellOutlined,
  HeartOutlined,
  SunOutlined,
  MoonOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logos/logo-dark.png";
import logoLight from "../../assets/logos/logo-light.png";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { toggleTheme } from "../../features/theme/theme.slice";
import { RootState } from "../../app/store";
import { logoutAsync } from "../../features/auth/auth.service";
import { useNavigation } from "../../hooks/useNavigation";
import { Grid } from "antd";
import { useMemo, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Header } = Layout;
const { useBreakpoint } = Grid;

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
  const isDark = theme === "dark";

  const screens = useBreakpoint();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // Xác định breakpoint
  const isMobile = useMemo(() => !screens.md, [screens]); // Mobile: < md
  const isTablet = useMemo(() => screens.md && !screens.lg, [screens]); // Tablet: md to lg
  const isTabletOrMobile = useMemo(() => !screens.xl, [screens]); // Tablet + Mobile: < xl

  const items: MenuItem[] = [
    { label: "Trang chủ", key: "home" },
    { label: "Bài viết hay", key: "best-articles" },
    { label: "Gợi ý quà tặng", key: "suggest-gift" },
    { label: "Chat bot", key: "chat-bot" },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    navigateTo(e.key);
    setMobileMenuVisible(false); // Đóng mobile menu khi chọn item
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: isTabletOrMobile ? "space-between" : "flex-start",
        background: isDark ? "#1f2937" : "#ffffff",
        padding: isTabletOrMobile ? "12px 20px" : "0px 70px",
        borderBottom: isDark ? "1px solid #374151" : "1px solid #f0f0f0",
        transition: "all 0.3s ease",
        height: "auto",
      }}
    >
      {/* Mobile/Tablet Layout */}
      {isTabletOrMobile ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: "12px",
          }}
        >
          {/* Logo */}
          <a
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onClick={() => navigateTo("/")}
          >
            <img
              src={isDark ? logoLight : logo}
              alt="Logo"
              style={{
                height: isMobile ? "28px" : "32px",
              }}
            />
          </a>

          {/* Right Section - Theme Toggle (tablet only) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: 1,
              justifyContent: "end",
            }}
          >
            {isTablet && (
              <Segmented
                size="small"
                shape="round"
                options={[
                  { value: "light", icon: <SunOutlined /> },
                  { value: "dark", icon: <MoonOutlined /> },
                ]}
                value={theme}
                onChange={() => dispatch(toggleTheme())}
                style={{ width: "auto" }}
              />
            )}
          </div>

          {/* Right Section - Notification + Menu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            {/* Notification Button - chỉ hiển thị khi đã đăng nhập */}
            {isAuthenticated && (
              <Popover
                placement="bottomRight"
                trigger={["click"]}
                title={
                  <Title
                    level={4}
                    style={{
                      fontFamily: "Oswald",
                      padding: "8px",
                      margin: 0,
                    }}
                  >
                    Thông báo
                  </Title>
                }
                content={
                  <List
                    style={{
                      width: "100%",
                      maxWidth: "300px",
                      maxHeight: "300px",
                      overflowY: "scroll",
                    }}
                    itemLayout="horizontal"
                    dataSource={list}
                    locale={{ emptyText: "Không có thông báo mới" }}
                    renderItem={(item: NotificationItem) => (
                      <List.Item
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
                      </List.Item>
                    )}
                  />
                }
              >
                <Button
                  icon={
                    <Badge count={list.length} className="cursor-pointer">
                      <BellOutlined
                        style={{
                          fontSize: isMobile ? "14px" : "16px",
                          cursor: "pointer",
                          color: isDark ? "#fff" : "#333",
                        }}
                      />
                    </Badge>
                  }
                  type="text"
                  size={isMobile ? "small" : "middle"}
                />
              </Popover>
            )}

            {/* Hamburger Menu Button */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              style={{
                color: isDark ? "#fff" : "#333",
                fontSize: isMobile ? "16px" : "18px",
              }}
              size={isMobile ? "small" : "middle"}
            />
          </div>
        </div>
      ) : (
        /* Desktop Layout */
        <>
          {/* Logo + Navigation */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {/* Logo */}
            <a
              style={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                cursor: "pointer",
              }}
              onClick={() => navigateTo("/")}
            >
              <img
                src={isDark ? logoLight : logo}
                alt="Logo"
                style={{
                  height: "40px",
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
                fontSize: "16px",
                background: "transparent",
                columnGap: "24px",
              }}
              theme={isDark ? "dark" : "light"}
              items={items}
            />
          </div>

          {/* Change Theme */}
          <Flex
            gap="small"
            align="center"
            style={{
              marginRight: "35px",
            }}
          >
            <Segmented
              size="middle"
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
              gap: "16px",
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
                  size="middle"
                />

                {/* Notification */}
                <Popover
                  placement="bottomRight"
                  trigger={["click"]}
                  title={
                    <Title
                      level={4}
                      style={{
                        fontFamily: "Oswald",
                        padding: "8px",
                        margin: 0,
                      }}
                    >
                      Thông báo
                    </Title>
                  }
                  content={
                    <List
                      style={{
                        width: "100%",
                        maxWidth: "400px",
                        maxHeight: "400px",
                        overflowY: "scroll",
                      }}
                      itemLayout="horizontal"
                      dataSource={list}
                      locale={{ emptyText: "Không có thông báo mới" }}
                      renderItem={(item: NotificationItem) => (
                        <List.Item
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
                        </List.Item>
                      )}
                    />
                  }
                >
                  <Button
                    icon={
                      <Badge count={list.length} className="cursor-pointer">
                        <BellOutlined
                          style={{
                            fontSize: "18px",
                            cursor: "pointer",
                            color: isDark ? "#fff" : "#333",
                          }}
                        />
                      </Badge>
                    }
                    type="text"
                    size="middle"
                  />
                </Popover>

                {/* Avatar */}
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "profile",
                        label: (
                          <span onClick={() => navigateTo("/user-dashboard")}>
                            Hồ sơ
                          </span>
                        ),
                      },
                      {
                        key: "setting",
                        label: (
                          <a onClick={() => navigateTo("/setting")}>Cài đặt</a>
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
                    size="default"
                    icon={<UserOutlined />}
                    style={{ cursor: "pointer" }}
                  />
                </Dropdown>
              </Flex>
            ) : (
              <Flex gap={12}>
                <Button
                  type="default"
                  onClick={() => navigateTo("/auth/login")}
                  style={{
                    fontFamily: "Oswald",
                    fontSize: "14px",
                    height: "36px",
                    padding: "0 16px",
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  type="primary"
                  style={{
                    padding: "0 20px",
                    fontFamily: "Oswald",
                    fontSize: "14px",
                    height: "36px",
                  }}
                  onClick={() => navigateTo("/auth/register")}
                >
                  Đăng ký
                </Button>
              </Flex>
            )}
          </div>
        </>
      )}

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", justifyContent: "end" }}>
            <img
              src={isDark ? logoLight : logo}
              alt="Logo"
              style={{ height: "32px", marginRight: "12px" }}
            />
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={320}
        style={{
          background: isDark ? "#1f2937" : "#ffffff",
        }}
      >
        {/* Navigation Menu */}
        <Menu
          onClick={onClick}
          selectedKeys={[currentPath]}
          mode="vertical"
          style={{
            border: "none",
            fontFamily: "Oswald",
            fontSize: "16px",
            background: "transparent",
          }}
          theme={isDark ? "dark" : "light"}
          items={items}
        />

        {/* User Actions */}
        {isAuthenticated ? (
          <div style={{ marginTop: 10 }}>
            <Title
              level={4}
              style={{ fontFamily: "Oswald", marginBottom: "16px" }}
            >
              Tài khoản
            </Title>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {/* WishList */}
              <Button
                type="primary"
                danger
                icon={<HeartOutlined />}
                size="large"
                style={{ fontFamily: "Oswald", justifyContent: "flex-start" }}
              >
                Danh sách yêu thích
              </Button>

              {/* Profile */}
              <Button
                icon={<UserOutlined />}
                type="text"
                size="large"
                onClick={() => {
                  navigateTo("/user-dashboard");
                  setMobileMenuVisible(false);
                }}
                style={{
                  fontFamily: "Oswald",
                  justifyContent: "flex-start",
                  width: "100%",
                  height: "auto",
                  padding: "8px 12px",
                }}
              >
                Hồ sơ cá nhân
              </Button>
              {/* Logout */}
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  logoutAsync();
                  setMobileMenuVisible(false);
                }}
                style={{
                  fontFamily: "Oswald",
                  justifyContent: "center",
                  width: "100%",
                  height: "auto",
                  padding: "8px 12px",
                }}
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 10 }}>
            <Title
              level={4}
              style={{ fontFamily: "Oswald", marginBottom: "16px" }}
            >
              Đăng nhập
            </Title>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <Button
                type="default"
                size="large"
                onClick={() => {
                  navigateTo("/auth/login");
                  setMobileMenuVisible(false);
                }}
                style={{
                  fontFamily: "Oswald",
                  justifyContent: "center",
                }}
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  navigateTo("/auth/register");
                  setMobileMenuVisible(false);
                }}
                style={{
                  fontFamily: "Oswald",
                  justifyContent: "center",
                }}
              >
                Đăng ký
              </Button>
            </div>
          </div>
        )}
        {/* Theme Toggle - chỉ hiển thị trên mobile */}
        {isMobile && (
          <div style={{ marginTop: 10 }}>
            <Title
              level={4}
              style={{ fontFamily: "Oswald", marginBottom: "16px" }}
            >
              Giao diện
            </Title>
            <Segmented
              size="large"
              shape="round"
              options={[
                { value: "light", icon: <SunOutlined /> },
                { value: "dark", icon: <MoonOutlined /> },
              ]}
              value={theme}
              onChange={() => dispatch(toggleTheme())}
            />
          </div>
        )}
      </Drawer>
    </Header>
  );
};

export default AppHeader;
