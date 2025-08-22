import React, { useState } from "react";
import { Button, Card, Row, Col, Typography, Statistic } from "antd";
import {
  PlusOutlined,
  RobotOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import AIPromptForm from "../../components/AIPromptForm";
import AIPromptList from "../../components/AIPromptList";
import { useAppDispatch } from "../../app/hook";
import { resetPrompt } from "../../features/ai_prompt/selectedAIPrompt.slice";
import ModalSchedule from "../../components/ModalSchedule";

const { Title, Text } = Typography;

const AIPrompt: React.FC = () => {
  const [isOpenModalForm, setIsOpenModalForm] = useState<boolean>(false);
  const [isOpenModalSchedule, setIsOpenModalSchedule] =
    useState<boolean>(false);
  const [aiPromptId, setAIPromptId] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onOpenModalSchedule = (aiPromptId: string) => {
    setAIPromptId(aiPromptId);
    setIsOpenModalSchedule(true);
  };
  const onCancelModalSchedule = () => {
    setIsOpenModalSchedule(false);
  };

  const onOpenAddPrompt = () => {
    setIsOpenModalForm(true);
    setIsEdit(false);
  };

  const onOpenFormEdit = () => {
    setIsOpenModalForm(true);
    setIsEdit(true);
  };

  const onCancel = () => {
    setIsOpenModalForm(false);
    setIsEdit(false);
    dispatch(resetPrompt());
  };

  // Mock data for statistics
  const stats = [
    {
      title: "Tổng số Prompts",
      value: 12,
      icon: <RobotOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
      color: "#1890ff",
    },
    {
      title: "Prompt đang chạy",
      value: 8,
      icon: <PlayCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
      color: "#52c41a",
    },
    {
      title: "Số lịch trình",
      value: 5,
      icon: <ClockCircleOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
      color: "#722ed1",
    },
    {
      title: "Đang chạy",
      value: 3,
      icon: <FireOutlined style={{ fontSize: 24, color: "#fa8c16" }} />,
      color: "#fa8c16",
    },
  ];

  return (
    <div
      style={{
        padding: "50px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        borderRadius: 15,
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "50px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "32px",
          }}
        >
          <div>
            <Title
              level={2}
              style={{ margin: 0, color: "#262626", fontWeight: 600 }}
            >
              Quản lý AI Prompt
            </Title>
            <Text
              style={{
                fontSize: "16px",
                color: "#8c8c8c",
                marginTop: "8px",
                display: "block",
              }}
            >
              Quản lý các lời nhắc AI và lịch trình nội dung của bạn
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            style={{
              height: "48px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 500,
              boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
            }}
            onClick={onOpenAddPrompt}
          >
            Tạo Prompt
          </Button>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card
                style={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
                  transition: "all 0.3s ease",
                }}
                hoverable
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  {stat.icon}
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: stat.color,
                      opacity: 0.8,
                    }}
                  />
                </div>
                <Statistic
                  title={
                    <Text
                      style={{
                        fontSize: "14px",
                        color: "#8c8c8c",
                        fontWeight: 500,
                      }}
                    >
                      {stat.title}
                    </Text>
                  }
                  value={stat.value}
                  valueStyle={{
                    fontSize: "28px",
                    fontWeight: 600,
                    color: stat.color,
                    lineHeight: 1.2,
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Content Section */}
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <ModalSchedule
          open={isOpenModalSchedule}
          onCancel={onCancelModalSchedule}
          aiPromptId={aiPromptId}
        />
        <AIPromptForm
          isEdit={isEdit}
          open={isOpenModalForm}
          onCancel={onCancel}
        />
        <AIPromptList
          onOpenModalEdit={onOpenFormEdit}
          onOpenModalSchedule={onOpenModalSchedule}
        />
      </div>
    </div>
  );
};

export default AIPrompt;
