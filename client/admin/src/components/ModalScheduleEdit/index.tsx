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
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
  SyncOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import { updateScheduleAsync } from "../../features/schedule/schedule.service";
import { setSchedule } from "../../features/schedule/schedule.slice";
// import { ContentSchedule } from "../../types/schedule.type";

const { Title } = Typography;

interface ModalScheduleEditProps {
  open: boolean;
  onCancel: () => void;
}

const ModalScheduleEdit: React.FC<ModalScheduleEditProps> = ({
  open,
  onCancel,
}) => {
  const dataSchedule = useAppSelector((state: RootState) => state.schedule);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (open && dataSchedule) {
      form.resetFields();
      form.setFieldsValue(dataSchedule);
    }
  }, [open, dataSchedule, form]);

  const handleUpdate = async (values: any) => {
    try {
      setIsLoading(true);
      const data = await updateScheduleAsync({
        _id: dataSchedule._id,
        ...values,
      });
      if (data.status >= 400) {
        return message.warning(data.message);
      }
      message.success(data.message);
      dispatch(setSchedule({ _id: dataSchedule._id, ...values }));
      setIsLoading(false);
      onCancel();
    } catch (error: any) {
      console.log(error.message);
      message.error(error.message);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
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

  return (
    <Modal
      title={
        <Space>
          <EditOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Chỉnh sửa lịch trình
          </Title>
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
      footer={null}
      destroyOnClose={true}
    >
      {open && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            autoPublish: true,
            status: "active",
          }}
        >
          <Row gutter={16}>
            {/* Basic Information */}
            <Col span={24}>
              <Title level={5}>Thông tin cơ bản</Title>
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
                    <Input placeholder="VD: Daily Morning Post" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="status" label="Trạng thái">
                    <Select
                      placeholder="Chọn trạng thái"
                      options={statusOptions}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* Schedule Configuration */}
            <Col span={24}>
              <Divider />
              <Title level={5}>Cấu hình lịch trình</Title>
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
                    <Switch checkedChildren="Có" unCheckedChildren="Không" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Actions */}
          <Divider />
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={handleCancel} icon={<CloseOutlined />}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                icon={<SaveOutlined />}
              >
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ModalScheduleEdit;
