import React, { useEffect } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Button,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  message,
  Modal,
} from "antd";
import {
  RobotOutlined,
  SettingOutlined,
  TagsOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface AIPromptFormProps {
  open: boolean;
  onCancel: () => void;
  loading?: boolean;
}

const AIPromptForm: React.FC<AIPromptFormProps> = ({ open, onCancel }) => {
  const initialData = {};
  const [form] = Form.useForm();
  const isEdit = !!initialData;

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue(initialData);
    } else if (open && !initialData) {
      form.resetFields();
    }
  }, [open, initialData, form]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      message.success(
        isEdit ? "Cập nhật prompt thành công!" : "Tạo prompt thành công!"
      );
      form.resetFields();
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const aiModels = {
    openai: ["gpt-4", "gpt-4-turbo", "gpt-4o", "gpt-3.5-turbo"],
    claude: ["claude-3-sonnet", "claude-3-haiku", "claude-3-opus"],
    gemini: ["gemini-1.5-flash", "gemini-1.0-pro"],
  };

  const categories = [
    { label: "Chatbot", value: "chatbot" },
    { label: "Gift", value: "gift" },
    { label: "Notification", value: "notification" },
    { label: "Article", value: "article" },
  ];

  return (
    <Modal
      centered
      style={{ marginTop: 30, marginBottom: 30 }}
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            {isEdit ? "Chỉnh sửa Prompt" : "Tạo Prompt mới"}
          </Title>
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      width={800}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          isActive: true,
          temperature: 0.7,
          maxTokens: 500,
          targetWordCount: 300,
          defaultTags: [],
          categories: [],
          availableVariables: [],
        }}
      >
        <Row gutter={24}>
          {/* Basic Information */}
          <Col span={24}>
            <Title level={5}>Thông tin cơ bản</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên Prompt"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên prompt!" },
                    { min: 3, message: "Tên phải có ít nhất 3 ký tự!" },
                  ]}
                >
                  <Input placeholder="VD: Daily Tech News" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="isActive"
                  label="Trạng thái"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Tạm dừng"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ max: 200, message: "Mô tả không được quá 200 ký tự!" }]}
            >
              <TextArea
                rows={3}
                placeholder="Mô tả ngắn gọn về prompt này..."
              />
            </Form.Item>
          </Col>

          {/* AI Configuration */}
          <Col span={24}>
            <Divider />
            <Title level={5}>
              <SettingOutlined /> Cấu hình AI
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="aiProvider"
                  label="AI Provider"
                  rules={[
                    { required: true, message: "Vui lòng chọn provider!" },
                  ]}
                >
                  <Select placeholder="Chọn AI Provider">
                    <Option value="openai">OpenAI</Option>
                    <Option value="claude">Claude</Option>
                    <Option value="gemini">Gemini</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="aiModel"
                  label="AI Model"
                  rules={[{ required: true, message: "Vui lòng chọn model!" }]}
                >
                  <Select
                    placeholder="Chọn AI Model"
                    // disabled={!form.getFieldValue("aiProvider")}
                  >
                    {form.getFieldValue("aiProvider") &&
                      aiModels[
                        form.getFieldValue(
                          "aiProvider"
                        ) as keyof typeof aiModels
                      ]?.map((model) => (
                        <Option key={model} value={model}>
                          {model}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="temperature"
                  label="Temperature (0-1)"
                  rules={[
                    { required: true, message: "Vui lòng nhập temperature!" },
                    {
                      type: "number",
                      min: 0,
                      max: 1,
                      message: "Temperature phải từ 0-1!",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={1}
                    step={0.1}
                    style={{ width: "100%" }}
                    placeholder="0.7"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="maxTokens"
                  label="Max Tokens"
                  rules={[
                    { required: true, message: "Vui lòng nhập max tokens!" },
                    {
                      type: "number",
                      min: 1,
                      message: "Max tokens phải lớn hơn 0!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="500"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="systemMessage" label="System Message (Tùy chọn)">
              <TextArea rows={3} placeholder="System message cho AI..." />
            </Form.Item>
          </Col>

          {/* Prompt Template */}
          <Col span={24}>
            <Divider />
            <Title level={5}>Prompt Template</Title>
            <Form.Item
              name="promptTemplate"
              rules={[
                { required: true, message: "Vui lòng nhập prompt template!" },
                {
                  min: 10,
                  message: "Prompt template phải có ít nhất 10 ký tự!",
                },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Nhập prompt template... Sử dụng {variable} để tạo biến động"
                style={{ fontFamily: "monospace" }}
              />
            </Form.Item>
          </Col>

          {/* Content Settings */}
          <Col span={24}>
            <Divider />
            <Title level={5}>
              <TagsOutlined /> Cài đặt nội dung
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="targetWordCount"
                  label="Số từ mục tiêu"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số từ mục tiêu!",
                    },
                    {
                      type: "number",
                      min: 1,
                      message: "Số từ phải lớn hơn 0!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="300"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="categories" label="Danh mục">
                  <Select
                    mode="multiple"
                    placeholder="Chọn danh mục"
                    options={categories}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="defaultTags" label="Tags mặc định">
              <Select
                mode="tags"
                placeholder="Nhập tags, nhấn Enter để thêm"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item name="availableVariables" label="Biến có sẵn">
              <Select
                mode="tags"
                placeholder="Nhập tên biến, nhấn Enter để thêm (VD: date, topic)"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Actions */}
        <Divider />
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit}>
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default AIPromptForm;
