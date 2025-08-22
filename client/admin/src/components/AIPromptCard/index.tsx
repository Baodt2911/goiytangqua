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
  message,
  Flex,
} from "antd";
import {
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { AIPrompt } from "../../types/ai_prompt.type";
import { useAppDispatch } from "../../app/hook";
import {
  deletePrompt,
  updatePrompt,
} from "../../features/ai_prompt/ai_prompt.slice";
import {
  changeActivePromptAsync,
  deletePromptAsync,
} from "../../features/ai_prompt/ai_prompt.service";
import { setPrompt } from "../../features/ai_prompt/selectedAIPrompt.slice";

const { Text, Title, Paragraph } = Typography;

type AIPromptCardProps = AIPrompt;
const getProviderColor = (provider: string | undefined) => {
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

const getCategoryColor = (category: string | undefined) => {
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

const AIPromptCard: React.FC<
  AIPromptCardProps & {
    onOpenModalEdit: () => void;
    onOpenModalSchedule: (aiPromptId: string) => void;
  }
> = (data) => {
  const { onOpenModalSchedule, onOpenModalEdit, ...promptProps } = data;
  const dispatch = useAppDispatch();
  const handleChangeActive = async (value: boolean) => {
    try {
      dispatch(updatePrompt({ ...promptProps, isActive: value }));
      const data = await changeActivePromptAsync(
        promptProps._id as string,
        value
      );
      if (data.status >= 400) {
        return message.warning(data.message);
      }
      message.success(data.message);
    } catch (error: any) {
      console.log(error.message);
      message.error(error.message);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      dispatch(deletePrompt(id));
      const data = await deletePromptAsync(id);
      if (data.status >= 400) {
        return message.warning(data.message);
      }
      message.success(data.message);
    } catch (error: any) {
      console.log(error.message);
      message.error(error.message);
    }
  };
  return (
    <Card
      hoverable={true}
      style={{
        borderLeft: promptProps.isActive
          ? "4px solid #52c41a"
          : "4px solid #d9d9d9",
        boxShadow: "0 0 5px 5px #eeeeee",
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
        <Title level={4} style={{ fontWeight: 500 }}>
          {promptProps.name}
        </Title>
        {/* Action buttons */}
        <Space size={8}>
          <Tooltip title="Lịch trình" placement="bottom">
            <Button
              disabled={!promptProps.isActive}
              type="text"
              icon={<ClockCircleOutlined />}
              size="small"
              onClick={() => onOpenModalSchedule(promptProps._id as string)}
            />
          </Tooltip>
          <Tooltip title="Sửa" placement="bottom">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                dispatch(setPrompt(promptProps));
                onOpenModalEdit();
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa" placement="bottom">
            <Popconfirm
              title="Bạn có chắc muốn xoá prompt này?"
              onConfirm={() => handleDeletePrompt(promptProps._id as string)}
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
          color={getProviderColor(promptProps.aiProvider)}
          style={{ fontWeight: "bold" }}
        >
          {promptProps.aiProvider} - {promptProps.aiModel}
        </Tag>
      </div>

      {/* SystemMessage */}
      {promptProps.systemMessage && (
        <div style={{ marginBottom: 16 }}>
          <Text code>{promptProps.systemMessage}</Text>
        </div>
      )}

      {/* Description */}
      {promptProps.description && (
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {promptProps.description}
          </Text>
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
            {promptProps.promptTemplate.length > 150
              ? `${promptProps.promptTemplate.substring(0, 150)}... Show more →`
              : promptProps.promptTemplate}
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
              {promptProps.temperature}
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
              {promptProps.maxTokens}
            </Text>
          </div>
        </Card>
      </div>

      {/* Categories */}
      {promptProps.categories && promptProps.categories.length > 0 && (
        <Flex gap={5} wrap style={{ marginBottom: 12 }}>
          <Text type="secondary" style={{ marginRight: 5, fontSize: 12 }}>
            Thể loại:
          </Text>
          {promptProps.categories.map((cat) => (
            <Tag key={cat} color={getCategoryColor(cat)}>
              {cat}
            </Tag>
          ))}
        </Flex>
      )}

      {/* Tags */}
      {promptProps.defaultTags.length > 0 && (
        <Flex gap={5} wrap style={{ marginBottom: 12 }}>
          <Text type="secondary" style={{ marginRight: 5, fontSize: 12 }}>
            Tags:
          </Text>
          {promptProps.defaultTags.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </Flex>
      )}

      {/* Variables */}
      {promptProps.availableVariables &&
        promptProps.availableVariables.length > 0 && (
          <Flex gap={5} wrap style={{ marginBottom: 12 }}>
            <Text type="secondary" style={{ marginRight: 5, fontSize: 12 }}>
              Variables:
            </Text>
            {promptProps.availableVariables.map((variable) => (
              <Tag key={variable} color="orange">
                {`{${variable}}`}
              </Tag>
            ))}
          </Flex>
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
          <Switch
            checked={promptProps.isActive}
            onChange={handleChangeActive}
            size="small"
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {promptProps.isActive ? "Hoạt động" : "Đã tắt"}
          </Text>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          <span style={{ marginRight: 5 }}>Cập nhật:</span>
          {new Date(promptProps.updatedAt as Date).toLocaleDateString("vi-VN")}
        </Text>
      </div>
    </Card>
  );
};

export default AIPromptCard;
