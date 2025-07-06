import {
  Flex,
  FloatButton,
  Input,
  Select,
  Space,
  Tooltip,
  Typography,
  Button,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import Editors from "../../components/Editors";
import { FormOutlined } from "@ant-design/icons";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { setDataPost } from "../../features/post/post.slice";
import { getFilters } from "../../features/filter/filter.service";
const { Title } = Typography;

const Article: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataPost = useAppSelector((state: RootState) => state.post);
  const [filters, setFilters] = useState<{ type: string; options: string[] }[]>(
    []
  );
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});
  const [modalOpen, setModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getFilters();
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

  const openFilterModal = () => {
    setTempFilters(selectedFilters);
    setModalOpen(true);
  };

  const handleSaveFilters = () => {
    setSelectedFilters(tempFilters);
    dispatch(setDataPost({ filters: tempFilters }));
    setModalOpen(false);
  };

  return (
    <Flex vertical style={{ width: "100%" }} gap={30}>
      <Flex
        style={{
          margin: 20,
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 5px 10px 0 #cccccc",
          height: 80,
        }}
      >
        <Input
          placeholder="Nhập tiêu đề của bài viết"
          variant="borderless"
          style={{
            height: "100%",
            fontSize: 20,
            fontWeight: 600,
            padding: "0 40px",
          }}
          onChange={(e: any) =>
            dispatch(setDataPost({ title: e.target.value }))
          }
        />
      </Flex>
      <Flex vertical style={{ width: "100%" }} gap={30}>
        {/* Text Editor  */}
        <Editors />

        <Flex style={{ flex: 1, width: "70%" }} gap={30}>
          <Flex vertical style={{ flex: 1 }} gap={10}>
            <Space direction="vertical" style={{ flex: 2 }}>
              <Flex style={{ alignItems: "center", gap: 5 }}>
                <Title level={5}>Slug</Title>
                <span style={{ fontSize: 18, color: "red" }}>*</span>
              </Flex>
              <Input
                placeholder="vd: tieu-de-cua-bai-viet"
                onChange={(e: any) =>
                  dispatch(setDataPost({ slug: e.target.value }))
                }
              />
            </Space>

            <Space direction="vertical" style={{ flex: 2 }}>
              <Flex style={{ alignItems: "center", gap: 5 }}>
                <Title level={5}>Tags</Title>
                <span style={{ fontSize: 18, color: "red" }}>*</span>
              </Flex>
              <Select
                style={{ width: "100%" }}
                mode="tags"
                placeholder="Tags"
                // options={hobbyOptions}
                maxCount={10}
                showSearch
                onChange={(value: any) =>
                  dispatch(setDataPost({ tags: value }))
                }
              />
            </Space>
          </Flex>
          <Flex vertical style={{ flex: 1 }} gap={10}>
            <Space
              direction="vertical"
              style={{ flex: 2, width: "100%" }}
              size={16}
            >
              <Title level={5}>Bộ lọc</Title>
              <Button
                color="primary"
                variant="outlined"
                onClick={openFilterModal}
                style={{ width: 180 }}
              >
                Chọn bộ lọc
              </Button>

              <Modal
                title="Chọn bộ lọc cho bài viết"
                open={modalOpen}
                onOk={handleSaveFilters}
                onCancel={() => setModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
              >
                {filters.map((filter) => (
                  <div key={filter.type} style={{ marginBottom: 16 }}>
                    <span style={{ fontWeight: 500 }}>{filter.type}:</span>
                    <Select
                      style={{ width: 220, marginLeft: 12 }}
                      placeholder={`Chọn ${filter.type.toLowerCase()}`}
                      options={filter.options.map((opt) => ({
                        label: opt,
                        value: opt,
                      }))}
                      value={tempFilters[filter.type]}
                      onChange={(value) => {
                        setTempFilters((prev) => ({
                          ...prev,
                          [filter.type]: value,
                        }));
                      }}
                      allowClear
                    />
                  </div>
                ))}
              </Modal>
            </Space>
          </Flex>
          <Flex vertical style={{ flex: 1 }} gap={10}>
            <Space direction="vertical" style={{ flex: 2 }}>
              <Title level={5}>Chọn các sản phẩm liên quan đến bài viết</Title>
              <Select
                style={{ width: "100%" }}
                mode="tags"
                placeholder="Tags"
                maxCount={10}
                showSearch
                onChange={(value: any) =>
                  dispatch(setDataPost({ tags: value }))
                }
              />
            </Space>
          </Flex>
        </Flex>
        <Tooltip title="Đăng bài">
          <FloatButton
            shape="circle"
            type="primary"
            style={{ insetInlineEnd: 50, width: 50, height: 50 }}
            icon={<FormOutlined style={{ fontSize: 20 }} />}
            onClick={() => console.log("Nội dung bài viết:", dataPost)}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default Article;
