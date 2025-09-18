import React, { useEffect } from "react";
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
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { formatTime } from "../../utils/formatTime";
const { Title, Text } = Typography;
import logo from "../../assets/logos/favicon_io_dark/favicon-32x32.png";

const ConversationSidebar: React.FC<{
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}> = ({ activeId, onSelect, onNewChat }) => {
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
  }, []);
  return (
    <Card
      title={
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
      }
      styles={{ body: { padding: 0, height: "calc(80vh - 57px)", display: "flex", flexDirection: "column" } }}
      bordered
      style={{ height: "80vh" }}
    >
      <div style={{ padding: 12, flexShrink: 0 }}>
        <Input prefix={<SearchOutlined />} placeholder="Search" allowClear />
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
                onClick={() => onSelect(item._id)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  background: isActive ? "rgba(255,107,129,0.08)" : undefined,
                }}
              >
                <List.Item.Meta
                  avatar={<img src={logo} alt="logo" />}
                  title={<Text strong>{item.title}</Text>}
                  description={
                    <Text type="secondary">{formatTime(item.updatedAt)}</Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      </div>
    </Card>
  );
};
export default ConversationSidebar;
