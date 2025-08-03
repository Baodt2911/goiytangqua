import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Space,
  Popconfirm,
  Tag,
  message,
  Card,
  Typography,
  Select,
} from "antd";
import {
  getFiltersAsync,
  addFilterAsync,
  deleteFilterAsync,
  updateFilterAsync,
} from "../../features/filter/filter.service";

const { Title } = Typography;

interface FilterType {
  _id?: string;
  type: string;
  options: string[];
}

const Filter: React.FC = () => {
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FilterType | null>(null);
  const [typeValue, setTypeValue] = useState("");
  const [optionsValue, setOptionsValue] = useState<string[]>([]);

  const fetchFilters = async () => {
    setLoading(true);
    try {
      const data = await getFiltersAsync();
      let arr: any = [];
      if (Array.isArray(data)) arr = data;
      else if (Array.isArray(data.data)) arr = data.data;
      else if (Array.isArray(data.filters)) arr = data.filters;
      setFilters(arr);
    } catch {
      message.error("Lỗi tải filter");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    if (modalOpen) {
      if (editing) {
        setTypeValue(editing.type);
        setOptionsValue(editing.options);
      } else {
        setTypeValue("");
        setOptionsValue([]);
      }
    }
  }, [modalOpen, editing]);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (record: FilterType) => {
    setEditing(record);
    setModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await deleteFilterAsync(id);
      message.success("Đã xóa filter");
      fetchFilters();
    } catch {
      message.error("Lỗi xóa filter");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    if (!typeValue.trim()) {
      message.error("Vui lòng nhập tên bộ lọc");
      return;
    }
    if (!optionsValue.length) {
      message.error("Vui lòng nhập ít nhất 1 tuỳ chọn");
      return;
    }
    const payload = {
      type: typeValue.trim(),
      options: optionsValue,
    };
    try {
      if (editing && editing._id) {
        await updateFilterAsync(editing._id, payload);
        message.success("Đã cập nhật filter");
      } else {
        await addFilterAsync(payload);
        message.success("Đã thêm filter");
      }
      setModalOpen(false);
      fetchFilters();
    } catch {
      message.error("Có lỗi xảy ra");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
      width: 70,
      render: (_: any, __: FilterType, idx: number) => idx + 1,
    },
    {
      title: "Tên bộ lọc",
      dataIndex: "type",
      key: "type",
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: "Danh sách tuỳ chọn",
      dataIndex: "options",
      key: "options",
      render: (options: string[]) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {options.map((opt) => (
            <Tag
              color="blue"
              key={opt}
              style={{ fontSize: 13, padding: "2px 10px" }}
            >
              {opt}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      width: 160,
      render: (_: any, record: FilterType) => (
        <Space
          size={"middle"}
          style={{ justifyContent: "center", width: "100%" }}
        >
          <Button
            onClick={() => handleEdit(record)}
            type="primary"
            ghost
            size="small"
            title="Sửa bộ lọc"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá bộ lọc này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger type="primary" ghost size="small" title="Xoá bộ lọc">
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "80%", margin: "0 auto", padding: 24 }}>
      <Card
        style={{ borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}
        styles={{ body: { padding: 24 } }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Quản lý bộ lọc
        </Title>
        <Button
          type="primary"
          onClick={handleAdd}
          style={{ marginBottom: 16, float: "right" }}
        >
          Thêm filter
        </Button>
        <Table
          columns={columns}
          dataSource={filters}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          bordered
          style={{ borderRadius: 12, overflow: "hidden" }}
          size="small"
          tableLayout="auto"
        />
        <Modal
          title={editing ? `Sửa bộ lọc: ${editing?.type}` : "Thêm bộ lọc mới"}
          open={modalOpen}
          onOk={handleModalOk}
          onCancel={() => setModalOpen(false)}
          okText={editing ? "Lưu" : "Thêm"}
          cancelText="Hủy"
          destroyOnClose
          footer={[
            <Button key="cancel" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={handleModalOk}>
              {editing ? "Lưu" : "Thêm"}
            </Button>,
          ]}
        >
          <div style={{ padding: 8 }}>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 6 }}
              >
                Tên bộ lọc
              </label>
              <Input
                value={typeValue}
                onChange={(e) => setTypeValue(e.target.value)}
                placeholder="Nhập tên bộ lọc (ví dụ: Màu sắc)"
                maxLength={32}
                style={{ marginBottom: 4, paddingLeft: 8 }}
              />
              <div style={{ color: "#888", fontSize: 12, marginLeft: 8 }}>
                Ví dụ: Màu sắc, Kích thước, Thương hiệu...
              </div>
            </div>
            <div style={{ marginBottom: 0 }}>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 6 }}
              >
                Danh sách tuỳ chọn
              </label>
              <Select
                mode="tags"
                style={{ width: "100%", marginBottom: 4, paddingLeft: 8 }}
                placeholder="Nhập hoặc chọn tuỳ chọn, nhấn Enter để thêm"
                value={optionsValue}
                onChange={setOptionsValue}
                open={undefined}
              />
              <div style={{ color: "#888", fontSize: 12, marginLeft: 8 }}>
                Nhập hoặc chọn các tuỳ chọn, nhấn Enter để thêm mới. Ví dụ: Đỏ,
                Xanh, Vàng...
              </div>
            </div>
          </div>
        </Modal>
      </Card>
    </div>
  );
};

export default Filter;
