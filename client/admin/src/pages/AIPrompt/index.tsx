import React, { useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { resetPrompt } from "../../features/ai_prompt/selectedAIPrompt.slice";
import ModalSchedule from "../../components/ModalSchedule";
import { getStatsOverviewAIAsync } from "../../features/stats/stats.service";
import { setStatsAI } from "../../features/stats/stats_ai.slice";
import { RootState } from "../../app/store";

const { Title, Text } = Typography;

const AIPrompt: React.FC = () => {
  const [isOpenModalForm, setIsOpenModalForm] = useState<boolean>(false);
  const [isOpenModalSchedule, setIsOpenModalSchedule] =
    useState<boolean>(false);
  const [aiPromptId, setAIPromptId] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const dataStats = useAppSelector((state: RootState) => state.statsAI);
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { stats } = await getStatsOverviewAIAsync();
        dispatch(setStatsAI(stats));
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchStats();
  }, []);

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
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
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
                <RobotOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#1890ff",
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
                    Tổng số Prompts
                  </Text>
                }
                value={dataStats.total_prompt}
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#1890ff",
                  lineHeight: 1.2,
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
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
                <PlayCircleOutlined
                  style={{ fontSize: 24, color: "#52c41a" }}
                />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#52c41a",
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
                    Prompt đang chạy
                  </Text>
                }
                value={dataStats.active_prompt}
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#52c41a",
                  lineHeight: 1.2,
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
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
                <ClockCircleOutlined
                  style={{ fontSize: 24, color: "#722ed1" }}
                />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#722ed1",
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
                    Số lịch trình
                  </Text>
                }
                value={dataStats.total_schedule}
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#722ed1",
                  lineHeight: 1.2,
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
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
                <FireOutlined style={{ fontSize: 24, color: "#fa8c16" }} />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#fa8c16",
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
                    Đang chạy
                  </Text>
                }
                value={dataStats.active_schedule}
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#fa8c16",
                  lineHeight: 1.2,
                }}
              />
            </Card>
          </Col>
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
