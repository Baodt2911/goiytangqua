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
  Upload,
  Image,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
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
import { deleteImage, uploadImage } from "../../features/image/image.service";
import { getPublicId } from "../../utils";
const { Title } = Typography;

const Writing: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedPost = useAppSelector((state: RootState) => state.selectedPost);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [openModalFilter, setOpenModalFilter] = useState<boolean>(false);
  const [openModalProduct, setOpenModalProduct] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setPreview(selectedPost.thumbnail);
  }, [selectedPost.thumbnail]);

  const onOpenFilterModal = () => {
    setOpenModalFilter(true);
  };

  const onOpenProductModal = () => {
    setOpenModalProduct(true);
  };

  const handleUploadImage = async () => {
    if (!uploadFile) {
      return selectedPost.thumbnail;
    }
    const formData = new FormData();
    formData.append("image", uploadFile);
    try {
      const data = await uploadImage(formData, {
        width: 800,
        height: 480,
        crop: "fit",
      });
      return data.url;
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    }
  };

  const handleBeforeUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      message.error("File quá lớn! Tối đa 2MB.");
      return false;
    }
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };
  const handleCreatePost = async () => {
    try {
      setIsLoading(true);
      const thumbnail = await handleUploadImage();

      const data = await createPostAsync({
        title: selectedPost.title,
        content: selectedPost.content,
        thumbnail: thumbnail ? thumbnail : selectedPost.thumbnail,
        description: selectedPost.description,
        slug: selectedPost.slug,
        filters: selectedPost.filters,
        products: selectedPost.products,
        tags: selectedPost.tags,
      });
      if (data.status >= 400) {
        setIsLoading(false);
        return message.warning(data.message);
      }
      message.success(data.message);
      dispatch(resetPost());
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
      setIsLoading(false);
    }
  };
  const handleUpdatePost = async () => {
    try {
      setIsLoading(true);
      let thumbnail = selectedPost.thumbnail;
      if (uploadFile) {
        thumbnail = await handleUploadImage();
        if (selectedPost.thumbnail && !selectedPost.thumbnail.includes('/images_product/default')) {
          await deleteImage(getPublicId(selectedPost.thumbnail));
        }
      }

      const data = await updatePostAsync({
        _id: selectedPost._id,
        title: selectedPost.title,
        content: selectedPost.content,
        thumbnail: thumbnail ? thumbnail : selectedPost.thumbnail,
        description: selectedPost.description,
        slug: selectedPost.slug,
        filters: selectedPost.filters,
        products: selectedPost.products,
        tags: selectedPost.tags,
        status: selectedPost.status,
        author: selectedPost.author,
      });
      if (data.status >= 400) {
        setIsLoading(false);
        return message.warning(data.message);
      }
      message.success(data.message);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
      setIsLoading(false);
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

        <Flex style={{ flex: 1 }} gap={24}>
          {/* Thumbnail Section */}
          <Flex vertical style={{ flex: 1 }} gap={8}>
            <Flex align="center" gap={6}>
              <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                Thumbnail
              </Title>
            </Flex>

            <Flex gap={16} align="flex-start">
              {/* Thumbnail Preview */}
              <div
                style={{
                  width: 200,
                  height: 100,
                  border: "2px dashed #d9d9d9",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  backgroundColor: "#fafafa",
                }}
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="Thumbnail preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "#8c8c8c" }}>
                    <div style={{ fontSize: 20 }}>📷</div>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <Flex vertical gap={12} style={{ flex: 1 }}>
                <div style={{ marginBottom: 8 }}>
                  <div
                    style={{ fontSize: 13, color: "#595959", marginBottom: 4 }}
                  >
                    <strong>Kích thước:</strong> 800×480px
                  </div>
                  <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                    JPG, PNG, GIF • Tối đa 2MB
                  </div>
                </div>

                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleBeforeUpload}
                >
                  {!preview && (
                    <Button type="dashed" size="large">
                      Chọn ảnh
                    </Button>
                  )}
                </Upload>
                {preview && (
                  <Button
                    danger
                    type="dashed"
                    size="large"
                    onClick={() => {
                      setPreview(null);
                    }}
                  >
                    Xóa
                  </Button>
                )}
              </Flex>
            </Flex>
          </Flex>

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

      {/* Loading  */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </Flex>
  );
};

export default Writing;
