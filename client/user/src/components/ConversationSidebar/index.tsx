import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import {
  getConversationsFailure,
  getConversationsStart,
  getConversationsSuccess,
} from "../../features/chat/conversation.slice";
import { getAllConversationsAsync } from "../../features/chat/chat.service";
import {
  Card,
  Flex,
  Typography,
  Tooltip,
  Button,
  Input,
  Space,
  List,
  Grid,
  Drawer,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { formatTime } from "../../utils/formatTime";
const { Title, Text } = Typography;

const { useBreakpoint } = Grid;
const ConversationSidebar: React.FC<{
  activeId: string | null;
  isOpenDrawer?: boolean;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onCloseDrawer?: () => void;
}> = ({ activeId, onSelect, onNewChat, onCloseDrawer, isOpenDrawer }) => {
  const screens = useBreakpoint();
  const isTabletOrMobile = useMemo(() => !screens.xl, [screens]);
  const { conversations, loading } = useAppSelector(
    (state: RootState) => state.conversation
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        dispatch(getConversationsStart());
        const { conversations } = await getAllConversationsAsync();
        dispatch(getConversationsSuccess(conversations));
      } catch (error: any) {
        console.error(error);
        dispatch(getConversationsFailure(error.message));
      }
    };
    fetchConversations();
  }, [dispatch]);

  const conversationContent = (
    <>
      <div style={{ padding: 12, flexShrink: 0 }}>
        <Flex align="center" justify="space-between">
          <Title level={4} style={{ margin: 0 }}>
            CHAT BOT
          </Title>
          <Space>
            <Tooltip title="Đoạn chat mới">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onNewChat}
              />
            </Tooltip>
          </Space>
        </Flex>
        <div style={{ marginTop: 12 }}>
          <Input prefix={<SearchOutlined />} placeholder="Search" allowClear />
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <List
          itemLayout="horizontal"
          dataSource={conversations}
          locale={{
            emptyText: "Bạn chưa có cuộc hội thoại nào!",
          }}
          loading={loading}
          style={{ height: "100%", overflowY: "auto" }}
          header={
            activeId === null ? (
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(255,107,129,0.08)",
                  borderBottom: "1px solid #f0f0f0",
                  fontWeight: "bold",
                  color: "#ff6b81",
                }}
              >
                ✨ Cuộc trò chuyện mới
              </div>
            ) : null
          }
          renderItem={(item) => {
            const isActive = item._id === activeId;
            return (
              <List.Item
                onClick={() => {
                  onSelect(item._id);
                  onCloseDrawer?.();
                }}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  background: isActive ? "rgba(255,107,129,0.08)" : undefined,
                }}
              >
                <List.Item.Meta
                  title={
                    <Text ellipsis={true} strong>
                      {item.title}
                    </Text>
                  }
                  description={
                    <Text type="secondary">{formatTime(item.updatedAt)}</Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      </div>
    </>
  );

  return isTabletOrMobile ? (
    <Drawer
      placement="left"
      onClose={onCloseDrawer}
      open={isOpenDrawer}
      width={320}
      styles={{
        body: {
          padding: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {conversationContent}
    </Drawer>
  ) : (
    <Card
      styles={{
        body: {
          padding: 0,
          height: "calc(80vh - 57px)",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        },
      }}
      bordered
      style={{ height: "80vh" }}
    >
      {conversationContent}
    </Card>
  );
};
export default ConversationSidebar;
