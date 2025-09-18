import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Space,
  Typography,
  Tag,
  Descriptions,
  Skeleton,
  Result,
} from "antd";
import {
  EditOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ModalScheduleEdit from "../ModalScheduleEdit";
import { getScheduleAsync } from "../../features/schedule/schedule.service";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import { resetSchedule, setSchedule } from "../../features/schedule/schedule.slice";

const { Title } = Typography;

interface ModalScheduleProps {
  open: boolean;
  onCancel: () => void;
  aiPromptId: string;
}
const getStatusColor = (status: string | undefined) => {
  switch (status) {
    case "active":
      return "green";
    case "paused":
      return "orange";
    case "completed":
      return "blue";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string | undefined) => {
  switch (status) {
    case "active":
      return <PlayCircleOutlined />;
    case "paused":
      return <PauseCircleOutlined />;
    case "completed":
      return <CheckCircleOutlined />;
    default:
      return null;
  }
};

const getFrequencyLabel = (frequency: string | undefined) => {
  switch (frequency) {
    case "once":
      return "Một lần";
    case "daily":
      return "Hàng ngày";
    case "weekly":
      return "Hàng tuần";
    case "monthly":
      return "Hàng tháng";
    default:
      return frequency;
  }
};

const getStatusLabel = (status: string | undefined) => {
  switch (status) {
    case "active":
      return "Hoạt động";
    case "paused":
      return "Tạm dừng";
    case "completed":
      return "Hoàn thành";
    default:
      return status;
  }
};

const formatDateTime = (date: Date | string | undefined) => {
  if (!date) return "Chưa có";
  const d = new Date(date);
  return d.toLocaleString("vi-VN");
};

const ModalSchedule: React.FC<ModalScheduleProps> = ({
  open,
  onCancel,
  aiPromptId,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dataSchedule = useAppSelector((state: RootState) => state.schedule);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const data = await getScheduleAsync(aiPromptId);
        if(data.schedule){
          dispatch(setSchedule(data.schedule));
        }
        else{
          dispatch(resetSchedule());
        }
        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
        setIsLoading(false);
      }
    };
    if (aiPromptId) {
      fetchSchedule();
    }
  }, [aiPromptId]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };


  return (
    <>
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            <Title level={4} style={{ margin: 0 }}>
              Chi tiết lịch trình
            </Title>
          </Space>
        }
        open={open}
        onCancel={onCancel}
        width={700}
        footer={
          <div style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={onCancel}>Đóng</Button>
              {dataSchedule.aiPromptId && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Chỉnh sửa
                </Button>
              )}
            </Space>
          </div>
        }
        destroyOnClose
      >
        {isLoading ? (
          <Skeleton active />
        ) : !dataSchedule.aiPromptId ? (
          <Result
            icon={<SettingOutlined style={{ color: '#faad14' }} />}
            title="Chưa thiết lập lịch trình"
            subTitle="Bạn chưa thiết lập lịch trình cho AI Prompt này. Hãy thiết lập để tự động tạo nội dung theo lịch."
            extra={
              <Button
                type="primary"
                icon={<SettingOutlined />}
                onClick={handleEdit}
                size="large"
              >
                Thiết lập lịch trình
              </Button>
            }
          />
        ) : (
          <div style={{ padding: "16px 0" }}>
            {/* Basic Information */}
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>Thông tin cơ bản</Title>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Tên lịch trình" span={2}>
                  {dataSchedule.name}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag
                    color={getStatusColor(dataSchedule.status)}
                    icon={getStatusIcon(dataSchedule.status)}
                    style={{ fontSize: 14, padding: "4px 8px" }}
                  >
                    {getStatusLabel(dataSchedule.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tự động xuất bản">
                  {dataSchedule.autoPublish ? "Có" : "Không"}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Schedule Configuration */}
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>Cấu hình lịch trình</Title>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Tần suất">
                  {getFrequencyLabel(dataSchedule.frequency)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian">
                  {dataSchedule.scheduleTime}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Statistics */}
            <div>
              <Title level={5}>Thống kê</Title>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Lần chạy tiếp theo">
                  <span style={{ color: "#1890ff", fontWeight: "bold" }}>
                    {formatDateTime(dataSchedule.nextRunAt)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Lần chạy cuối">
                  <span style={{ color: "#52c41a" }}>
                    {formatDateTime(dataSchedule.lastRunAt)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng số lần chạy" span={2}>
                  <span style={{ color: "#722ed1", fontWeight: "bold" }}>
                    {dataSchedule.totalRuns} lần
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <ModalScheduleEdit 
        open={isEditModalOpen} 
        onCancel={handleEditCancel} 
        aiPromptId={aiPromptId}
      />
    </>
  );
};

export default ModalSchedule;
