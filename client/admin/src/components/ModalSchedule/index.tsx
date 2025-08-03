import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  Typography,
  Row,
  Col,
  message,
  Divider,
  Tag,
} from "antd";
import {
  ClockCircleOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
  SyncOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

interface ContentSchedule {
  name: string;
  aiPromptId: string;
  frequency: "once" | "daily" | "weekly" | "monthly";
  scheduleTime: string;
  nextRunAt: Date;
  autoPublish: boolean;
  status: "active" | "paused" | "completed";
  lastRunAt?: Date;
  totalRuns: number;
}

interface ModalScheduleProps {
  open: boolean;
  initialData?: ContentSchedule;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ModalSchedule: React.FC<ModalScheduleProps> = ({
  open,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const isEdit = !!initialData;

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue(initialData);
      setIsEditMode(false);
    } else if (open && !initialData) {
      form.resetFields();
      setIsEditMode(true);
    }
  }, [open, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      message.success(
        isEdit
          ? "Cập nhật lịch trình thành công!"
          : "Tạo lịch trình thành công!"
      );
      form.resetFields();
      setIsEditMode(false);
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditMode(false);
    onCancel();
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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

  const frequencyOptions = [
    {
      label: (
        <Space>
          <CalendarIcon />
          Một lần
        </Space>
      ),
      value: "once",
    },
    {
      label: (
        <Space>
          <ClockIcon />
          Hàng ngày
        </Space>
      ),
      value: "daily",
    },
    {
      label: (
        <Space>
          <SyncOutlined />
          Hàng tuần
        </Space>
      ),
      value: "weekly",
    },
    {
      label: (
        <Space>
          <ReloadOutlined />
          Hàng tháng
        </Space>
      ),
      value: "monthly",
    },
  ];

  const statusOptions = [
    {
      label: (
        <Space>
          <PlayCircleOutlined style={{ color: "#52c41a" }} />
          Hoạt động
        </Space>
      ),
      value: "active",
    },
    {
      label: (
        <Space>
          <PauseCircleOutlined style={{ color: "#faad14" }} />
          Tạm dừng
        </Space>
      ),
      value: "paused",
    },
    {
      label: (
        <Space>
          <CheckCircleOutlined style={{ color: "#1890ff" }} />
          Hoàn thành
        </Space>
      ),
      value: "completed",
    },
  ];

  const getTimePlaceholder = (frequency: string) => {
    switch (frequency) {
      case "once":
        return "YYYY-MM-DD HH:mm";
      case "daily":
        return "HH:mm (VD: 08:00)";
      case "weekly":
        return "Day-HH:mm (VD: Mon-08:00)";
      case "monthly":
        return "DD-HH:mm (VD: 01-08:00)";
      default:
        return "Nhập thời gian";
    }
  };

  const formatDateTime = (date: Date | string) => {
    if (!date) return "Chưa có";
    const d = new Date(date);
    return d.toLocaleString("vi-VN");
  };

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined />
          <Title level={4} style={{ margin: 0 }}>
            {isEdit ? "Chi tiết lịch trình" : "Tạo lịch trình mới"}
          </Title>
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      width={600}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          autoPublish: true,
          status: "active",
          totalRuns: 0,
        }}
      >
        <Row gutter={16}>
          {/* Basic Information */}
          <Col span={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Title level={5}>Thông tin cơ bản</Title>
              {isEdit && (
                <Button
                  type="text"
                  icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
                  onClick={toggleEditMode}
                >
                  {isEditMode ? "Lưu thay đổi" : "Chỉnh sửa"}
                </Button>
              )}
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên lịch trình"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên lịch trình!",
                    },
                    { min: 3, message: "Tên phải có ít nhất 3 ký tự!" },
                  ]}
                >
                  <Input
                    placeholder="VD: Daily Morning Post"
                    readOnly={isEdit && !isEditMode}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="status" label="Trạng thái">
                  <Select
                    placeholder="Chọn trạng thái"
                    options={statusOptions}
                    disabled={isEdit && !isEditMode}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          {/* Schedule Configuration */}
          <Col span={24}>
            <Divider />
            <Title level={5}>
              <ClockCircleOutlined /> Cấu hình lịch trình
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="frequency"
                  label="Tần suất"
                  rules={[
                    { required: true, message: "Vui lòng chọn tần suất!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn tần suất"
                    options={frequencyOptions}
                    disabled={isEdit && !isEditMode}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="scheduleTime"
                  label="Thời gian"
                  rules={[
                    { required: true, message: "Vui lòng nhập thời gian!" },
                  ]}
                >
                  <Input
                    placeholder={getTimePlaceholder(
                      form.getFieldValue("frequency")
                    )}
                    readOnly={isEdit && !isEditMode}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="autoPublish"
                  label="Tự động xuất bản"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                    disabled={isEdit && !isEditMode}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          {/* Statistics (Readonly) */}
          {isEdit && (
            <Col span={24}>
              <Divider />
              <Title level={5}>Thống kê</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="nextRunAt" label="Lần chạy tiếp theo">
                    <Input
                      value={formatDateTime(form.getFieldValue("nextRunAt"))}
                      readOnly
                      style={{ color: "#1890ff", fontWeight: "bold" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lastRunAt" label="Lần chạy cuối">
                    <Input
                      value={formatDateTime(form.getFieldValue("lastRunAt"))}
                      readOnly
                      style={{ color: "#52c41a" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="totalRuns" label="Tổng số lần chạy">
                    <Input
                      value={`${form.getFieldValue("totalRuns") || 0} lần`}
                      readOnly
                      style={{ color: "#722ed1", fontWeight: "bold" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="status" label="Trạng thái hiện tại">
                    <Tag
                      color={getStatusColor(form.getFieldValue("status"))}
                      icon={getStatusIcon(form.getFieldValue("status"))}
                      style={{ fontSize: 14, padding: "4px 8px" }}
                    >
                      {form.getFieldValue("status") === "active" && "Hoạt động"}
                      {form.getFieldValue("status") === "paused" && "Tạm dừng"}
                      {form.getFieldValue("status") === "completed" &&
                        "Hoàn thành"}
                    </Tag>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          )}
        </Row>

        {/* Actions */}
        <Divider />
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={handleCancel} icon={<CloseOutlined />}>
              Hủy
            </Button>
            {(isEdit && isEditMode) || !isEdit ? (
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                icon={<SaveOutlined />}
              >
                {isEdit ? "Cập nhật" : "Tạo mới"}
              </Button>
            ) : null}
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalSchedule;
