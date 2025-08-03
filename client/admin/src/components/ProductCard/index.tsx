import React from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Card,
  Typography,
  Collapse,
  Flex,
  Tag,
  Popconfirm,
  Button,
  message,
  Image,
} from "antd";
import type { CollapseProps } from "antd";
import { useAppDispatch } from "../../app/hook";
import { setProduct } from "../../features/product/selectedProduct.slice";
import { ProductType } from "../../types/product.type";
import { deleteProductAsync } from "../../features/product/product.service";
import { deleteProduct } from "../../features/product/product.slice";
const { Meta } = Card;
const { Text, Link } = Typography;
type ProductCardProps = ProductType;

const ProductCard: React.FC<ProductCardProps & { onOpenEditProduct: any }> = (
  data
) => {
  const { onOpenEditProduct, ...productProps } = data;
  const dispatch = useAppDispatch();
  const items: CollapseProps["items"] = [
    {
      key: productProps._id,
      label: "Thông tin sản phẩm",
      children: (
        <Flex vertical gap={5}>
          <Text>
            <b>Giá:</b>{" "}
            <b style={{ color: "#ff4d4f", fontSize: "16px" }}>
              {productProps.price.toLocaleString("vi-VN")}đ
            </b>
          </Text>
          <Text ellipsis={{ tooltip: productProps.description }}>
            <b>Mô tả:</b> {productProps.description}
          </Text>
          <Text>
            <b>Loại:</b> {productProps.category}
          </Text>
          <Link href={productProps.link}>Link sản phẩm</Link>
          <Flex wrap gap={"small"}>
            {productProps?.tags.map((item, index) => (
              <Tag
                key={index}
                color="blue"
                style={{ fontSize: 13, padding: "2px 10px" }}
              >
                {item}
              </Tag>
            ))}
          </Flex>
        </Flex>
      ),
    },
  ];
  const handleDeleteProduct = async (_id: string) => {
    try {
      const data = await deleteProductAsync(_id);
      if (data.status >= 400) {
        return message.warning(data.message);
      }
      dispatch(deleteProduct(_id));
      message.success(data.message);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    }
  };
  return (
    <Card
      style={{ boxShadow: "0 0 10px 5px #f5f5f5" }}
      cover={
        <Image
          width={"100%"}
          height={"400px"}
          style={{ objectFit: "cover", borderRadius: "10px 10px 0 0" }}
          alt={productProps.name}
          src={productProps.image}
        />
      }
      actions={[
        <Button
          type="text"
          onClick={() => {
            dispatch(setProduct(productProps));
            onOpenEditProduct();
          }}
          icon={<EditOutlined key="edit" />}
        />,
        <Popconfirm
          title="Bạn có chắc muốn xoá sản phẩm này?"
          onConfirm={() => handleDeleteProduct(productProps._id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="text" icon={<DeleteOutlined key="delete" />} />,
        </Popconfirm>,
      ]}
    >
      <Meta
        title={productProps.name}
        description={
          <Flex vertical gap={10}>
            <Text type="secondary">{productProps.slug}</Text>
            <Collapse ghost items={items} />
          </Flex>
        }
      />
    </Card>
  );
};

export default ProductCard;
