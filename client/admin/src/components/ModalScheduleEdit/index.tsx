import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
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
  DatePicker,
  TimePicker,
  Card,
  Alert,
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
  SettingOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import { updateScheduleAsync, createScheduleAsync } from "../../features/schedule/schedule.service";
import { setSchedule } from "../../features/schedule/schedule.slice";
const { Title } = Typography;

interface ModalScheduleEditProps {
  open: boolean;
  onCancel: () => void;
  aiPromptId?: string;
}

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
  
    const weekDayOptions = [
    { label: 'Chủ nhật', value: 'Sun' },
    { label: 'Thứ hai', value: 'Mon' },
    { label: 'Thứ ba', value: 'Tue' },
    { label: 'Thứ tư', value: 'Wed' },
    { label: 'Thứ năm', value: 'Thu' },
    { label: 'Thứ sáu', value: 'Fri' },
    { label: 'Thứ bảy', value: 'Sat' },
  ];

const ModalScheduleEdit: React.FC<ModalScheduleEditProps> = ({
  open,
  onCancel,
  aiPromptId,
}) => {
  const dataSchedule = useAppSelector((state: RootState) => state.schedule);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [selectedFrequency, setSelectedFrequency] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<number>(1);

  useEffect(() => {
    if (open && dataSchedule) {
      form.resetFields();
      form.setFieldsValue(dataSchedule);
      setSelectedFrequency(dataSchedule.frequency || "");
      parseExistingScheduleTime(dataSchedule.frequency || "", dataSchedule.scheduleTime || "");
    } else if (open) {
      form.resetFields();
      setSelectedFrequency("");
      setSelectedDay("");
      setSelectedTime(null);
      setSelectedDate(null);
      setSelectedDayOfMonth(1);
    }
  }, [open, dataSchedule, form]);

  useEffect(() => {
    if (selectedFrequency) {
      handleTimeInputChange();
    }
  }, [selectedFrequency, selectedDay, selectedTime, selectedDate, selectedDayOfMonth]);

  const handleUpdate = async (values: any) => {
    try {
      setIsLoading(true);
      const data = await updateScheduleAsync({
        _id: dataSchedule._id,
        ...values,
      });
      if (data.status >= 400) {
        setIsLoading(false);
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

  const handleCreateSchedule = async (values: any) => {
    try {
      setIsLoading(true);
      const data = await createScheduleAsync({
        aiPromptId,
        ...values,
      });
      if (data.status >= 400) {
        setIsLoading(false);
        return message.warning(data.message);
      }
      message.success(data.message);
      dispatch(setSchedule({ aiPromptId, ...values }));
      setIsLoading(false);
      onCancel();
    } catch (error: any) {
      console.log(error.message);
      message.error(error.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    if (dataSchedule?._id) {
      await handleUpdate(values);
    } else {
      await handleCreateSchedule(values);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedFrequency("");
    setSelectedDay("");
    setSelectedTime(null);
    setSelectedDate(null);
    setSelectedDayOfMonth(1);
    onCancel();
  };

  const handleFrequencyChange = (value: string) => {
    setSelectedFrequency(value);
    // Reset other fields when frequency changes
    setSelectedDay("");
    setSelectedTime(null);
    setSelectedDate(null);
    setSelectedDayOfMonth(1);
    form.setFieldValue('scheduleTime', '');
  };


  const generateDayOptions = () => {
    const options = [];
    for (let i = 1; i <= 31; i++) {
      options.push({ label: `Ngày ${i}`, value: i });
    }
    return options;
  };

  const handleTimeInputChange = () => {
    let scheduleTimeValue = '';
    
    if (selectedFrequency === 'once' && selectedDate && selectedTime) {
      const dateStr = selectedDate.format('YYYY-MM-DD');
      const timeStr = selectedTime.format('HH:mm');
      scheduleTimeValue = `${dateStr} ${timeStr}`;
    } else if (selectedFrequency === 'daily' && selectedTime) {
      scheduleTimeValue = selectedTime.format('HH:mm');
    } else if (selectedFrequency === 'weekly' && selectedDay && selectedTime) {
      scheduleTimeValue = `${selectedDay}-${selectedTime.format('HH:mm')}`;
    } else if (selectedFrequency === 'monthly' && selectedDayOfMonth && selectedTime) {
      const dayStr = selectedDayOfMonth.toString().padStart(2, '0');
      scheduleTimeValue = `${dayStr}-${selectedTime.format('HH:mm')}`;
    }
    
    form.setFieldValue('scheduleTime', scheduleTimeValue);
  };

  const parseExistingScheduleTime = (frequency: string, scheduleTime: string) => {
    if (!scheduleTime) return;
    
    try {
      if (frequency === 'once') {
        // Format: "YYYY-MM-DD HH:mm"
        const [datePart, timePart] = scheduleTime.split(' ');
        if (datePart && timePart) {
          setSelectedDate(dayjs(datePart));
          setSelectedTime(dayjs(timePart, 'HH:mm'));
        }
      } else if (frequency === 'daily') {
        // Format: "HH:mm"
        setSelectedTime(dayjs(scheduleTime, 'HH:mm'));
      } else if (frequency === 'weekly') {
        // Format: "Day-HH:mm"
        const [day, time] = scheduleTime.split('-');
        if (day && time) {
          setSelectedDay(day);
          setSelectedTime(dayjs(time, 'HH:mm'));
        }
      } else if (frequency === 'monthly') {
        // Format: "DD-HH:mm"
        const [day, time] = scheduleTime.split('-');
        if (day && time) {
          setSelectedDayOfMonth(parseInt(day));
          setSelectedTime(dayjs(time, 'HH:mm'));
        }
      }
    } catch (error) {
      console.log('Error parsing schedule time:', error);
    }
  };



  return (
    <Modal
      title={
        <Space>
          {dataSchedule?._id ? <EditOutlined /> : <SettingOutlined />}
          <Title level={4} style={{ margin: 0 }}>
            {dataSchedule?._id ? 'Chỉnh sửa lịch trình' : 'Tạo mới lịch trình'}
          </Title>
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      width={800}
      footer={null}
      destroyOnClose={true}
    >
      {open && (
        <div style={{ padding: '8px' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              autoPublish: true,
              status: "active",
            }}
          >
            {/* Basic Information Card */}
            <Card 
              title={
                <Space>
                  <InfoCircleOutlined style={{ color: '#1890ff' }} />
                  <span>Thông tin cơ bản</span>
                </Space>
              }
              style={{ marginBottom: 24 }}
              size="small"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
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
                      size="large"
                    />
                  </Form.Item>
                </Col>
                {
                  dataSchedule?._id && (
                  <Col xs={24} sm={12}>
                    <Form.Item name="status" label="Trạng thái">
                      <Select
                        placeholder="Chọn trạng thái"
                        options={statusOptions}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  )
                }
              </Row>
            </Card>

            {/* Schedule Configuration Card */}
            <Card 
              title={
                <Space>
                  <SettingOutlined style={{ color: '#52c41a' }} />
                  <span>Cấu hình lịch trình</span>
                </Space>
              }
              style={{ marginBottom: 24 }}
              size="small"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="frequency"
                    label="Tần suất thực hiện"
                    rules={[
                      { required: true, message: "Vui lòng chọn tần suất!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn tần suất"
                      options={frequencyOptions}
                      onChange={handleFrequencyChange}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="autoPublish"
                    label="Tự động xuất bản"
                    valuePropName="checked"
                  >
                    <div style={{ paddingTop: 8 }}>
                      <Switch 
                        checkedChildren="Bật" 
                        unCheckedChildren="Tắt" 
                        size="default"
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              {/* Hidden schedule time field */}
              <Form.Item
                name="scheduleTime"
                style={{ display: 'none' }}
              >
                <Input />
              </Form.Item>

              {/* Frequency-specific time configuration */}
              {selectedFrequency && (
                <div style={{ marginTop: 16 }}>
                  <Alert
                    message={`Cấu hình thời gian cho lịch trình ${selectedFrequency === 'once' ? 'một lần' : selectedFrequency === 'daily' ? 'hàng ngày' : selectedFrequency === 'weekly' ? 'hàng tuần' : 'hàng tháng'}`}
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  
                  {selectedFrequency === 'once' && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Chọn ngày thực hiện">
                          <DatePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày"
                            style={{ width: '100%' }}
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Chọn giờ thực hiện">
                          <TimePicker
                            value={selectedTime}
                            onChange={setSelectedTime}
                            format="HH:mm"
                            placeholder="Chọn giờ"
                            style={{ width: '100%' }}
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  
                  {selectedFrequency === 'daily' && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Chọn giờ thực hiện hàng ngày">
                          <TimePicker
                            value={selectedTime}
                            onChange={setSelectedTime}
                            format="HH:mm"
                            placeholder="VD: 08:00"
                            style={{ width: '100%' }}
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  
                  {selectedFrequency === 'weekly' && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Chọn ngày trong tuần">
                          <Select
                            value={selectedDay}
                            onChange={setSelectedDay}
                            placeholder="Chọn ngày trong tuần"
                            options={weekDayOptions}
                            style={{ width: '100%' }}
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Chọn giờ thực hiện">
                          <TimePicker
                            value={selectedTime}
                            onChange={setSelectedTime}
                            format="HH:mm"
                            placeholder="Chọn giờ"
                            style={{ width: '100%' }}
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  
                  {selectedFrequency === 'monthly' && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Chọn ngày trong tháng">
                          <Select
                            value={selectedDayOfMonth}
                            onChange={setSelectedDayOfMonth}
                            placeholder="Chọn ngày trong tháng"
                            options={generateDayOptions()}
                            style={{ width: '100%' }}
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Chọn giờ thực hiện">
                          <TimePicker
                            value={selectedTime}
                            onChange={setSelectedTime}
                            format="HH:mm"
                            placeholder="Chọn giờ"
                            style={{ width: '100%' }}
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </div>
              )}
            </Card>

            {/* Actions */}
            <div style={{ textAlign: "right", paddingTop: 16 }}>
              <Space size="middle">
                <Button 
                  onClick={handleCancel} 
                  icon={<CloseOutlined />}
                  size="large"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  {dataSchedule?._id ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default ModalScheduleEdit;
