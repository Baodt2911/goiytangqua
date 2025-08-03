import React from "react";
import {
  Card,
  Tag,
  Space,
  Typography,
  Switch,
  Button,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  RobotOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Text, Title, Paragraph } = Typography;

interface AIPromptCardProps {
  data: {
    name: string;
    promptTemplate: string;
    description?: string;
    aiProvider: "openai" | "claude" | "gemini";
    aiModel: string;
    temperature: number;
    maxTokens: number;
    systemMessage?: string;
    categories?: ("chatbot" | "gift" | "notification" | "article")[];
    defaultTags: string[];
    targetWordCount: number;
    availableVariables?: string[];
    isActive: boolean;
  };
  onSchedule?: () => void;
  onOpenModalEdit: () => void;
}

const AIPromptCard: React.FC<AIPromptCardProps> = ({
  data,
  onSchedule,
  onOpenModalEdit,
}) => {
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "openai":
        return "green";
      case "claude":
        return "blue";
      case "gemini":
        return "purple";
      default:
        return "default";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "chatbot":
        return "green";
      case "gift":
        return "pink";
      case "notification":
        return "purple";
      case "article":
        return "orange";
      default:
        return "default";
    }
  };

  return (
    <Card
      hoverable={true}
      style={{
        width: "500px",
        borderLeft: data.isActive ? "4px solid #52c41a" : "4px solid #d9d9d9",
      }}
    >
      {/* Header with title and actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <RobotOutlined style={{ color: "#1890ff", fontSize: 18 }} />
          <Title level={4} style={{ margin: 0, fontWeight: "bold" }}>
            {data.name}
          </Title>
        </div>

        {/* Action buttons */}
        <Space size={8}>
          <Tooltip title="Lịch trình" placement="bottom">
            <Button
              type="text"
              icon={<ClockCircleOutlined />}
              size="small"
              onClick={onSchedule}
            />
          </Tooltip>
          <Tooltip title="Sửa" placement="bottom">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={onOpenModalEdit}
            />
          </Tooltip>
          <Tooltip title="Xóa" placement="bottom">
            <Popconfirm
              title="Bạn có chắc muốn xoá prompt này?"
              onConfirm={() => {}}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined key="delete" />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      </div>

      {/* Provider and Model */}
      <div style={{ marginBottom: 12 }}>
        <Tag
          color={getProviderColor(data.aiProvider)}
          style={{ fontWeight: "bold" }}
        >
          {data.aiProvider} - {data.aiModel}
        </Tag>
        {!data.isActive && (
          <Text type="secondary" style={{ marginLeft: 8 }}>
            Inactive
          </Text>
        )}
      </div>

      {/* Description */}
      {data.description && (
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">{data.description}</Text>
        </div>
      )}

      {/* Prompt Template */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          Prompt Template:
        </Text>
        <div
          style={{
            background: "#fafafa",
            padding: 12,
            borderRadius: 6,
            borderLeft: "4px solid #617dfc",
          }}
        >
          <Paragraph
            ellipsis={{
              rows: 3,
              expandable: true,
              symbol: "Xem thêm",
            }}
            type="secondary"
            style={{ fontSize: 12, fontFamily: "monospace" }}
          >
            {data.promptTemplate.length > 150
              ? `${data.promptTemplate.substring(0, 150)}... Show more →`
              : data.promptTemplate}
          </Paragraph>
        </div>
      </div>

      {/* AI Settings */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Card
          bordered={false}
          size="small"
          style={{ flex: 1, textAlign: "center", background: "#fafafa" }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            Temperature
          </Text>
          <div>
            <Text type="warning" strong>
              {data.temperature}
            </Text>
          </div>
        </Card>
        <Card
          bordered={false}
          size="small"
          style={{ flex: 1, textAlign: "center", background: "#fafafa" }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            Max Tokens
          </Text>
          <div>
            <Text type="success" strong>
              {data.maxTokens}
            </Text>
          </div>
        </Card>
      </div>

      {/* Categories */}
      {data.categories && data.categories.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Categories:{" "}
            {data.categories.map((cat) => (
              <Tag key={cat} color={getCategoryColor(cat)}>
                {cat}
              </Tag>
            ))}
          </Text>
        </div>
      )}

      {/* Tags */}
      {data.defaultTags.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Tags:{" "}
            {data.defaultTags.map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
          </Text>
        </div>
      )}

      {/* Variables */}
      {data.availableVariables && data.availableVariables.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Variables:{" "}
            {data.availableVariables.map((variable) => (
              <Tag key={variable} color="orange">
                {`{${variable}}`}
              </Tag>
            ))}
          </Text>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Switch checked={data.isActive} onChange={() => {}} size="small" />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {data.isActive ? "Active" : "Inactive"}
          </Text>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Cập nhật: {new Date().toLocaleDateString("vi-VN")}
        </Text>
      </div>
    </Card>
  );
};

export default AIPromptCard;
