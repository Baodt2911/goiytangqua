import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  DatePicker,
  Row,
  Col,
  Avatar,
  Typography,
  Divider,
  Tooltip,
  List,
  App,
  Spin,
  Alert,
  Form,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  UserOutlined,
  HeartOutlined,
  TeamOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { RelationshipType } from "../../types/relationship.type";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  getRelationshipAsync,
  createRelationshipAsync,
  updateRelationshipAsync,
  deleteRelationshipAsync,
} from "../../features/relationship/relationship.service";
import {
  getRelationshipsStart,
  getRelationshipsSuccess,
  getRelationshipsFailure,
  createRelationship,
  updateRelationship,
  deleteRelationship,
} from "../../features/relationship/relationship.slice";

// 🎨 pool màu & icon
const colors = [
  "#7FB3D5",
  "#82E0AA",
  "#F5B7B1",
  "#C39BD3",
  "#F8C471",
  "#F5CBA7",
]; // pastel tones
const tagColors = ["blue", "green", "red", "purple", "orange", "gold"];
const icons = [
  <UserOutlined />,
  <HeartOutlined />,
  <TeamOutlined />,
  <SmileOutlined />,
];

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}
function getStyleByType(type: string) {
  const hash = hashString(type);
  return {
    color: tagColors[hash % tagColors.length],
    icon: icons[hash % icons.length],
  };
}
function getAvatarStyle(seed: string) {
  const hash = hashString(seed);
  const bg = colors[hash % colors.length];
  return { backgroundColor: bg, color: "#2D3436" };
}
function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const RelationshipManagement: React.FC = () => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const { relationships, loading, error } = useAppSelector(
    (state) => state.relationship
  );
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<RelationshipType | null>(null);

  // Load relationships on component mount
  useEffect(() => {
    const loadRelationships = async () => {
      try {
        dispatch(getRelationshipsStart());
        const { relationships } = await getRelationshipAsync();

        dispatch(getRelationshipsSuccess(relationships));
      } catch (err: any) {
        dispatch(getRelationshipsFailure(err.message));
        message.error(err.message);
      }
    };

    loadRelationships();
  }, [dispatch, message]);

  const handleOpen = (rel?: RelationshipType) => {
    if (rel) {
      setEditing(rel);
      form.setFieldsValue({
        name: rel.name,
        relationshipType: rel.relationshipType,
        preferences: rel.preferences || [],
        anniversaries:
          rel.anniversaries?.map((ann) => ({
            name: ann.name,
            date: dayjs()
              .month((ann.date as any).month - 1)
              .date((ann.date as any).day),
          })) || [],
      });
    } else {
      setEditing(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const transformedValues = {
        ...values,
        anniversaries:
          values.anniversaries?.map((ann: any) => ({
            name: ann.name,
            date: {
              day: ann.date.date(),
              month: ann.date.month() + 1,
            },
          })) || [],
      };

      if (editing) {
        const updatedData = { ...transformedValues, _id: editing._id };
        const data = await updateRelationshipAsync(updatedData);
        if (data.status >= 400) {
          return message.warning(data.message);
        }
        message.success(data.message);
        dispatch(updateRelationship(updatedData));
      } else {
        const data = await createRelationshipAsync(transformedValues);
        if (data.status >= 400) {
          return message.warning(data.message);
        }
        message.success(data.message);
        dispatch(createRelationship(transformedValues));
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      if (err.errorFields) {
        message.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      } else {
        message.error(editing ? "Cập nhật thất bại" : "Thêm thất bại");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const data = await deleteRelationshipAsync(id);
      if (data.status >= 400) {
        return message.warning(data.message);
      }
      message.success(data.message);
      dispatch(deleteRelationship(id));
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <div>
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpen()}
          loading={loading}
        >
          Thêm
        </Button>
      </div>

      <Spin spinning={loading}>
        <List
          style={{ width: "100%" }}
          grid={{ gutter: 35, column: 1 }}
          dataSource={relationships || []}
          renderItem={(rel) => (
            <List.Item
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: 12,
                padding: 14,
                borderRadius: 12,
                boxShadow: "0 5px 10px 0 #f5f5f5",
                background: "transparent",
              }}
            >
              <Avatar
                size={48}
                style={getAvatarStyle(rel.name)}
                icon={undefined}
              >
                {getInitials(rel.name)}
              </Avatar>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography.Text strong style={{ fontSize: 16 }}>
                    {rel.name}
                  </Typography.Text>
                  <Tag
                    color={getStyleByType(rel.relationshipType).color}
                    icon={getStyleByType(rel.relationshipType).icon}
                    style={{ borderRadius: 999 }}
                  >
                    {rel.relationshipType}
                  </Tag>
                </div>

                {rel.preferences && rel.preferences.length > 0 && (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    {rel.preferences.map((p) => (
                      <Tag
                        key={p}
                        style={{
                          borderRadius: 999,
                          background: "transparent",
                          border: "1px dashed #ffd6bf",
                          color: "#ad4e00",
                        }}
                      >
                        {p}
                      </Tag>
                    ))}
                  </div>
                )}

                {rel.anniversaries && rel.anniversaries.length > 0 && (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    {rel.anniversaries.map((a, i) => (
                      <Tag
                        key={i}
                        icon={<CalendarOutlined />}
                        color="orange"
                        style={{ borderRadius: 8 }}
                      >
                        {a.name}: {(a.date as any).day}/{(a.date as any).month}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>

              <Space direction="vertical" size={6} align="end">
                <Tooltip title="Chỉnh sửa">
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleOpen(rel)}
                  />
                </Tooltip>
                <Popconfirm
                  title="Xóa mối quan hệ này?"
                  onConfirm={() => handleDelete(rel._id!)}
                >
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            </List.Item>
          )}
        />
      </Spin>

      {/* Modal Form */}
      <Modal
        open={isModalOpen}
        title={null}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSave}
        okText={editing ? "Lưu thay đổi" : "Thêm"}
        cancelText="Hủy"
        styles={{
          content: { borderRadius: 16, overflow: "hidden" },
          header: { display: "none" },
          footer: { borderTop: "none" },
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {editing ? "Chỉnh sửa mối quan hệ" : "Thêm mối quan hệ"}
          </Typography.Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            preferences: [],
            anniversaries: [],
          }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên"
                rules={[
                  { required: true, message: "Vui lòng nhập tên" },
                  { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
                ]}
              >
                <Input placeholder="Ví dụ: Nguyễn Minh Anh" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="relationshipType"
                label="Loại quan hệ"
                rules={[
                  { required: true, message: "Vui lòng nhập loại quan hệ" },
                  { min: 2, message: "Loại quan hệ phải có ít nhất 2 ký tự" },
                ]}
              >
                <Input placeholder="Ví dụ: Bạn bè, Anh trai, Đồng nghiệp" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="preferences" label="Sở thích">
            <Select
              mode="tags"
              placeholder="Thêm sở thích (nhập và nhấn Enter)"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Divider style={{ margin: "12px 0" }} />

          <Form.Item label="Kỷ niệm">
            <Form.List name="anniversaries">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={12} style={{ marginBottom: 8 }}>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tên kỷ niệm",
                            },
                          ]}
                        >
                          <Input placeholder="Tên kỷ niệm" />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, "date"]}
                          rules={[
                            { required: true, message: "Vui lòng chọn ngày" },
                          ]}
                        >
                          <DatePicker
                            picker="date"
                            format="DD/MM"
                            placeholder="Chọn ngày"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </Row>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "100%" }}
                  >
                    Thêm kỷ niệm
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RelationshipManagement;
