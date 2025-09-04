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
  activeId: string;
  onSelect: (id: string) => void;
}> = ({ activeId, onSelect }) => {
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
              <Button type="primary" icon={<PlusOutlined />} />
            </Tooltip>
          </Space>
        </Flex>
      }
      styles={{ body: { padding: 0 } }}
      bordered
      style={{ height: "100%" }}
    >
      <div style={{ padding: 12 }}>
        <Input prefix={<SearchOutlined />} placeholder="Search" allowClear />
      </div>
      <List
        itemLayout="horizontal"
        dataSource={conversations}
        locale={{
          emptyText: "Bạn chưa có cuộc hội thoại nào!",
        }}
        loading={loading}
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
    </Card>
  );
};
export default ConversationSidebar;
