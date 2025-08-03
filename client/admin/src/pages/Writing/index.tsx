import {
  Flex,
  FloatButton,
  Input,
  Select,
  Space,
  Tooltip,
  Typography,
  Button,
  message,
} from "antd";
import React, { useState } from "react";
import Editors from "../../components/Editors";
import {
  FilterOutlined,
  FormOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { resetPost, setPost } from "../../features/post/selectedPost.slice";
import ModalFilter from "../../components/ModalFilter";
import ModalProduct from "../../components/ModalProduct";
import {
  createPostAsync,
  updatePostAsync,
} from "../../features/post/post.service";
const { Title } = Typography;

const Writing: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedPost = useAppSelector((state: RootState) => state.selectedPost);
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [openModalProduct, setOpenModalProduct] = useState(false);

  const onOpenFilterModal = () => {
    setOpenModalFilter(true);
  };

  const onOpenProductModal = () => {
    setOpenModalProduct(true);
  };

  const handleCreatePost = async () => {
    try {
      const convertProducts = selectedPost.products.reduce(
        (acc: string[], current) => {
          acc.push(current._id);
          return acc;
        },
        []
      );

      const data = await createPostAsync({
        title: selectedPost.title,
        slug: selectedPost.slug,
        content: selectedPost.content,
        tags: selectedPost.tags,
        filters: selectedPost.filters,
        products: convertProducts,
      });
      if (data.status >= 400) {
        return message.warning(data.message);
      }
      message.success(data.message);
      dispatch(resetPost());
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    }
  };
  const handleUpdatePost = async () => {
    try {
      const convertProducts = selectedPost.products.reduce(
        (acc: string[], current) => {
          acc.push(current._id);
          return acc;
        },
        []
      );
      const data = await updatePostAsync({
        _id: selectedPost._id,
        title: selectedPost.title,
        slug: selectedPost.slug,
        content: selectedPost.content,
        tags: selectedPost.tags,
        filters: selectedPost.filters,
        products: convertProducts,
      });
      if (data.status >= 400) {
        return message.warning(data.message);
      }
      message.success(data.message);
      dispatch(resetPost());
    } catch (error: any) {
      console.log(error);

      message.error(error.message);
    }
  };
  return (
    <Flex vertical style={{ width: "100%" }} gap={30}>
      <Flex
        style={{
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
          value={selectedPost.title}
          onChange={(e: any) => dispatch(setPost({ title: e.target.value }))}
        />
      </Flex>
      <Flex vertical style={{ width: "100%" }} gap={30}>
        {/* Text Editor  */}
        <Editors />

        <Flex style={{ flex: 1, width: "70%" }} gap={24}>
          {/* Cột trái - Slug và Tags */}
          <Flex vertical style={{ flex: 1.2 }} gap={20}>
            {/* Slug Field */}
            <Space direction="vertical" size={8}>
              <Flex align="center" gap={6}>
                <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                  Slug
                </Title>
                <span style={{ fontSize: 16, color: "#ff4d4f" }}>*</span>
              </Flex>
              <Input
                placeholder="vd: tieu-de-cua-bai-viet"
                size="large"
                value={selectedPost.slug}
                onChange={(e) => dispatch(setPost({ slug: e.target.value }))}
                style={{
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </Space>

            {/* Tags Field */}
            <Space direction="vertical" size={8}>
              <Flex align="center" gap={6}>
                <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                  Tags
                </Title>
                <span style={{ fontSize: 16, color: "#ff4d4f" }}>*</span>
              </Flex>
              <Select
                style={{
                  width: "100%",
                  borderRadius: 8,
                }}
                size="large"
                mode="tags"
                placeholder="Chọn hoặc nhập tags mới..."
                maxCount={10}
                showSearch
                allowClear
                value={selectedPost.tags}
                onChange={(value) => dispatch(setPost({ tags: value }))}
              />
            </Space>
          </Flex>

          {/* Cột phải - Bộ lọc và Sản phẩm */}
          <Flex vertical style={{ flex: 1 }} gap={20}>
            {/* Bộ lọc */}
            <Space direction="vertical" size={8}>
              <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                Bộ lọc
              </Title>
              <Button
                type="dashed"
                size="large"
                onClick={onOpenFilterModal}
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 8,
                  borderStyle: "dashed",
                  borderWidth: 2,
                  fontSize: 14,
                  fontWeight: 500,
                }}
                icon={<FilterOutlined />}
              >
                Chọn bộ lọc
              </Button>
            </Space>

            {/* Sản phẩm liên quan */}
            <Space direction="vertical" size={8}>
              <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                Sản phẩm liên quan
              </Title>
              <Button
                type="dashed"
                size="large"
                onClick={onOpenProductModal}
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 8,
                  borderStyle: "dashed",
                  borderWidth: 2,
                  fontSize: 14,
                  fontWeight: 500,
                }}
                icon={<ShoppingOutlined />}
              >
                Chọn sản phẩm
              </Button>
            </Space>
          </Flex>

          {/* Modal */}
          <ModalProduct
            open={openModalProduct}
            onCancel={() => setOpenModalProduct(false)}
          />
          {/* Modal */}
          <ModalFilter
            open={openModalFilter}
            onCancel={() => setOpenModalFilter(false)}
          />
        </Flex>

        <Tooltip
          title={selectedPost._id ? "Cập nhật bài viết" : "Đăng bài viết"}
        >
          <FloatButton
            shape="circle"
            type="primary"
            style={{ insetInlineEnd: 50, width: 50, height: 50 }}
            icon={<FormOutlined style={{ fontSize: 20 }} />}
            onClick={() => {
              if (selectedPost._id) {
                handleUpdatePost();
              } else {
                handleCreatePost();
              }
            }}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default Writing;
