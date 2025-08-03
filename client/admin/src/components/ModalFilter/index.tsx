import React, { useEffect, useState } from "react";
import { Modal, Select, List, Input } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { getFiltersAsync } from "../../features/filter/filter.service";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import { setPost } from "../../features/post/selectedPost.slice";

const ModalFilter: React.FC<{ open: boolean; onCancel: () => void }> = ({
  open,
  onCancel,
}) => {
  const [filters, setFilters] = useState<{ type: string; options: string[] }[]>(
    []
  );
  const [searchText, setSearchText] = useState("");
  const filtersPost = useAppSelector(
    (state: RootState) => state.selectedPost.filters
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getFiltersAsync();
        let arr: any = [];
        if (Array.isArray(data)) arr = data;
        else if (Array.isArray(data.data)) arr = data.data;
        else if (Array.isArray(data.filters)) arr = data.filters;
        setFilters(arr);
      } catch {
        // ignore
      }
    };
    fetchFilters();
  }, []);

  // Lọc theo search text
  const filteredFilters = filters.filter((filter) =>
    filter.type.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "18px",
            fontWeight: 600,
            color: "#1f2937",
          }}
        >
          <FilterOutlined style={{ color: "#3b82f6" }} />
          Chọn bộ lọc cho bài viết ({filters.length})
        </div>
      }
      open={open}
      onOk={onCancel}
      onCancel={onCancel}
      okText="Áp dụng bộ lọc"
      cancelText="Hủy bỏ"
      width={600}
      okButtonProps={{
        style: {
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          border: "none",
          borderRadius: "8px",
          fontWeight: 500,
          height: "40px",
          paddingLeft: "24px",
          paddingRight: "24px",
        },
      }}
      cancelButtonProps={{
        style: {
          borderRadius: "8px",
          height: "40px",
          paddingLeft: "24px",
          paddingRight: "24px",
          borderColor: "#d1d5db",
        },
      }}
    >
      {/* Tìm kiếm bộ lọc */}
      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm bộ lọc..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />

      {/* Danh sách bộ lọc */}
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        <List
          dataSource={filteredFilters}
          renderItem={(filter) => (
            <List.Item
              key={filter.type}
              style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                {/* Tên bộ lọc */}
                <div
                  style={{
                    minWidth: 140,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#374151",
                    textTransform: "capitalize",
                  }}
                >
                  {filter.type}:
                </div>

                {/* Select */}
                <div style={{ flex: 1 }}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder={`Chọn ${filter.type.toLowerCase()}...`}
                    options={filter.options.map((opt) => ({
                      label: opt,
                      value: opt,
                    }))}
                    value={filtersPost[filter.type]}
                    onChange={(value) => {
                      dispatch(
                        setPost({
                          filters: { ...filtersPost, [filter.type]: value },
                        })
                      );
                    }}
                    allowClear
                    size="middle"
                  />
                </div>
              </div>
            </List.Item>
          )}
          locale={{
            emptyText: searchText
              ? `Không tìm thấy bộ lọc cho "${searchText}"`
              : "Không có bộ lọc nào",
          }}
        />
      </div>

      {/* Footer thông tin */}
      <div
        style={{
          marginTop: 16,
          padding: "8px 12px",
          backgroundColor: "#f6f6f6",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <span>
          Hiển thị {filteredFilters.length}/{filters.length} bộ lọc
          {searchText && ` cho "${searchText}"`}
        </span>
      </div>
    </Modal>
  );
};

export default ModalFilter;
