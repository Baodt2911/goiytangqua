import React, { useState } from "react";
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
  Empty,
  Tooltip,
  List,
  App,
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
  const [relationships, setRelationships] = useState<RelationshipType[]>([
    {
      _id: "1",
      name: "Hoàng Văn Đình",
      relationshipType: "Bạn bè",
      preferences: ["đọc sách", "chơi game"],
      anniversaries: [
        { name: "Sinh nhật", date: { day: 22, month: 7 } },
        { name: "Kỷ niệm gặp nhau", date: { day: 12, month: 7 } },
      ],
    },
    {
      _id: "2",
      name: "Đỗ Trọng Chi",
      relationshipType: "Anh trai",
      preferences: ["trà", "đi bộ"],
      anniversaries: [{ name: "Sinh nhật", date: { day: 29, month: 11 } }],
    },
    {
      _id: "3",
      name: "Đỗ Người Yêu",
      relationshipType: "Người yêu",
      preferences: ["trà", "đi bộ"],
      anniversaries: [{ name: "Sinh nhật", date: { day: 29, month: 11 } }],
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<RelationshipType | null>(null);
  const [formData, setFormData] = useState<RelationshipType>({
    _id: "",
    name: "",
    relationshipType: "",
    preferences: [],
    anniversaries: [],
  });

  const handleOpen = (rel?: RelationshipType) => {
    if (rel) {
      setEditing(rel);
      setFormData(rel);
    } else {
      setEditing(null);
      setFormData({
        _id: "",
        name: "",
        relationshipType: "",
        preferences: [],
        anniversaries: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.relationshipType) {
      message.error("Tên và loại quan hệ bắt buộc");
      return;
    }
    if (editing) {
      setRelationships((prev) =>
        prev.map((r) =>
          r._id === editing._id ? { ...formData, _id: editing._id } : r
        )
      );
      message.success("Cập nhật thành công");
    } else {
      setRelationships((prev) => [
        ...prev,
        { ...formData, _id: Date.now().toString() },
      ]);
      message.success("Thêm thành công");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setRelationships((prev) => prev.filter((r) => r._id !== id));
    message.success("Xóa thành công");
  };

  return (
    <div>
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
        >
          Thêm
        </Button>
      </div>
      <List
        style={{ width: "100%" }}
        grid={{ gutter: 35, column: 1 }}
        dataSource={relationships}
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
            <Avatar size={48} style={getAvatarStyle(rel.name)} icon={undefined}>
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
                      {a.name}: {a.date.day}/{a.date.month}
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

      {/* Modal Form */}
      <Modal
        open={isModalOpen}
        title={null}
        onCancel={() => setIsModalOpen(false)}
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
        <Row gutter={12}>
          <Col span={12}>
            <Typography.Text
              strong
              style={{ display: "block", marginBottom: 6 }}
            >
              Tên
            </Typography.Text>
            <Input
              placeholder="Ví dụ: Nguyễn Minh Anh"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={{ marginBottom: 12 }}
            />
          </Col>
          <Col span={12}>
            <Typography.Text
              strong
              style={{ display: "block", marginBottom: 6 }}
            >
              Loại quan hệ
            </Typography.Text>
            <Input
              placeholder="Ví dụ: Bạn bè, Anh trai, Đồng nghiệp"
              value={formData.relationshipType}
              onChange={(e) =>
                setFormData({ ...formData, relationshipType: e.target.value })
              }
              style={{ marginBottom: 12 }}
            />
          </Col>
        </Row>
        <Typography.Text strong style={{ display: "block", marginBottom: 6 }}>
          Sở thích
        </Typography.Text>
        <Select
          mode="tags"
          placeholder="Thêm sở thích (nhập và nhấn Enter)"
          style={{ width: "100%", marginBottom: 12 }}
          value={formData.preferences}
          onChange={(v) => setFormData({ ...formData, preferences: v })}
        />
        <Divider style={{ margin: "12px 0" }} />
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Typography.Text strong>Kỷ niệm</Typography.Text>
          <Button
            type="dashed"
            onClick={() =>
              setFormData({
                ...formData,
                anniversaries: [
                  ...formData.anniversaries,
                  {
                    name: "Sự kiện",
                    date: { day: dayjs().date(), month: dayjs().month() + 1 },
                  },
                ],
              })
            }
          >
            Thêm kỷ niệm
          </Button>
        </Space>
        {formData.anniversaries.map((ann, idx) => (
          <Row key={idx} gutter={12} style={{ marginBottom: 8 }}>
            <Col span={12}>
              <Input
                placeholder="Tên kỷ niệm"
                value={ann.name}
                onChange={(e) => {
                  const newA = [...formData.anniversaries];
                  newA[idx].name = e.target.value;
                  setFormData({ ...formData, anniversaries: newA });
                }}
              />
            </Col>
            <Col span={12}>
              <DatePicker
                picker="date"
                format="DD/MM"
                value={dayjs()
                  .month(ann.date.month - 1)
                  .date(ann.date.day)}
                onChange={(d) => {
                  const newA = [...formData.anniversaries];
                  newA[idx].date = { day: d!.date(), month: d!.month() + 1 };
                  setFormData({ ...formData, anniversaries: newA });
                }}
              />
            </Col>
          </Row>
        ))}
      </Modal>
    </div>
  );
};

export default RelationshipManagement;
