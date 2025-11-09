import { Card, Flex, Space, Typography, Tooltip, Button, Avatar } from "antd";
import React, { useState } from "react";
import logo from "../../assets/logos/favicon_io_dark/favicon-32x32.png";
import dayjs from "dayjs";
import { CopyOutlined } from "@ant-design/icons";
import { MessageType } from "../../types/message.type";
const { Text } = Typography;

const MessageBubble: React.FC<{
  message: MessageType;
  isStreaming?: boolean;
}> = ({ message, isStreaming = false }) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <Flex
      align="start"
      justify={isUser ? "flex-end" : "flex-start"}
      style={{ width: "100%" }}
    >
      {!isUser && <img src={logo} alt="logo" />}
      <Card
        style={{
          maxWidth: 720,
          margin: "10px 12px",
          borderRadius: 16,
          border: "1px solid #eef0f5",
          background: isUser ? "#e6f4ff" : "#f7f8fa",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Flex
          align="center"
          justify="space-between"
          style={{ marginBottom: 6 }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            {isUser ? "You" : "Assistant"} ·{" "}
            {dayjs(message.createdAt).format("HH:mm")}
          </Text>
          <Space size={4}>
            <Tooltip title={copied ? "Đã sao chép" : "Sao chép"}>
              <Button
                size="small"
                type="text"
                icon={<CopyOutlined />}
                onClick={handleCopy}
                disabled={isStreaming}
              />
            </Tooltip>
          </Space>
        </Flex>
        <Text style={{ whiteSpace: "pre-wrap" }}>
          {message.content}
          {isStreaming && (
            <span
              style={{
                color: "#666",
                marginLeft: "4px",
                animation: "typing 1.4s infinite",
                display: "inline-block",
              }}
            >
              ...
            </span>
          )}
        </Text>
        <style>
          {`
            @keyframes typing {
              0%, 20% { opacity: 1; }
              40%, 60% { opacity: 0.3; }
              80%, 100% { opacity: 1; }
            }
          `}
        </style>
      </Card>
      {isUser && (
        <Avatar style={{ background: "#FF6B81" }} size={36}>
          U
        </Avatar>
      )}
    </Flex>
  );
};

export default MessageBubble;
