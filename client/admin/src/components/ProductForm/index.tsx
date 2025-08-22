import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Space,
  Upload,
  Modal,
  Row,
  Col,
  message,
} from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { resetProduct } from "../../features/product/selectedProduct.slice";
import { deleteImage, uploadImage } from "../../features/image/image.service";
import {
  createProductAsync,
  updateProductAsync,
} from "../../features/product/product.service";
import {
  createProduct,
  updateProduct,
} from "../../features/product/product.slice";
import { RootState } from "../../app/store";
import { getPublicId } from "../../utils";
const { TextArea } = Input;
const ProductForm: React.FC<{
  open: boolean;
  isEdit: boolean;
  onCancel: () => void;
}> = ({ open, isEdit, onCancel }) => {
  const dataProduct = useAppSelector((sate: RootState) => sate.selectedProduct);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (open && dataProduct) {
      form.setFieldsValue(dataProduct);
    }
  }, [open, dataProduct, form]);

  useEffect(() => {
    setPreview(dataProduct.image);
  }, [dataProduct.image]);

  const handleUploadImage = async () => {
    if (!uploadFile) {
      return preview;
    }
    const formData = new FormData();
    formData.append("image", uploadFile);
    try {
      const data = await uploadImage(formData);
      return data.url;
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    }
  };

  const handleCreateProduct = async (values: any) => {
    try {
      setIsLoading(true);
      const image = await handleUploadImage();
      if (!image) {
        setIsLoading(false);
        return message.warning("Vui lòng tải ảnh lên!");
      }
      const data = await createProductAsync({ image, ...values });
      if (data.status >= 400) {
        setIsLoading(false);
        return message.warning(data.message);
      }
      dispatch(createProduct(data.product));
      message.success(data.message);
      setIsLoading(false);
      onCancel();
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (values: any) => {
    try {
      setIsLoading(true);
      let image = dataProduct.image;
      if (uploadFile) {
        image = await handleUploadImage();
        if (image) {
          await deleteImage(getPublicId(dataProduct.image));
        }
      }
      const data = await updateProductAsync({
        _id: dataProduct._id,
        image,
        ...values,
      });
      if (data.status >= 400) {
        setIsLoading(false);
        return message.warning(data.message);
      }
      dispatch(
        updateProduct({
          _id: dataProduct._id,
          image,
          ...values,
        })
      );
      message.success(data.message);
      setIsLoading(false);
      onCancel();
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
      setIsLoading(false);
    }
  };
  const handleBeforeUpload = (file: File) => {
    setUploadFile(file);
    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    return false;
  };

  return (
    <Modal
      title={isEdit ? "Sửa sản phẩm" : "Tạo sản phẩm mới"}
      centered
      open={open}
      onCancel={onCancel}
      destroyOnClose={true}
      footer={null}
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
      style={{ paddingTop: 20, paddingBottom: 20 }}
    >
      <Row gutter={[35, 35]}>
        <Col span={12}>
          <Form
            form={form}
            layout="vertical"
            onFinish={isEdit ? handleUpdateProduct : handleCreateProduct}
            initialValues={{ tags: [], price: 0 }}
          >
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Slug"
              name="slug"
              rules={[{ required: true, message: "Vui lòng nhập slug!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Giá (VND)"
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} step={1000} />
            </Form.Item>

            <Form.Item
              label="Link sản phẩm"
              name="link"
              rules={[
                { required: true, message: "Vui lòng nhập link sản phẩm!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Loại"
              name="category"
              rules={[{ required: true, message: "Vui lòng ít nhất 1 loại!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tags"
              name="tags"
              rules={[{ required: true, message: "Vui nhập ít nhất 1 tag!" }]}
            >
              <Select
                mode="tags"
                placeholder="Nhập tags"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  {isEdit ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    dispatch(resetProduct());
                  }}
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>

        <Col span={12}>
          {preview ? (
            <div style={{ position: "relative", width: "100%", height: "50%" }}>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 15,
                  objectFit: "cover",
                  boxShadow: "0 5px 10px 5px #f5f5f5",
                }}
              />
              <button
                type="button"
                style={{
                  position: "absolute",
                  top: 5,
                  left: 5,
                  background: "transperent",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 50,
                }}
                onClick={() => setPreview(null)}
              >
                <CloseOutlined />
              </button>
            </div>
          ) : (
            <Upload
              listType="picture-card"
              maxCount={1}
              showUploadList={false}
              beforeUpload={handleBeforeUpload}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            </Upload>
          )}
        </Col>
      </Row>
    </Modal>
  );
};

export default ProductForm;
