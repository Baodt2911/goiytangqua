import React, { useState } from "react";
import { Flex } from "antd";
import ProductList from "../../components/ProductList";
import ProductForm from "../../components/ProductForm";
import { resetProduct } from "../../features/product/selectedProduct.slice";
import { useAppDispatch } from "../../app/hook";

const Product: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const onOpenEditProduct = () => {
    setOpen(true);
    setIsEdit(true);
  };
  const onOpenAddProduct = () => {
    setOpen(true);
    setIsEdit(false);
  };
  const onCancel = () => {
    setOpen(false);
    setIsEdit(false);
    dispatch(resetProduct());
  };

  return (
    <Flex vertical gap={50}>
      <ProductList
        onOpenEditProduct={onOpenEditProduct}
        onOpenAddProduct={onOpenAddProduct}
      />
      <ProductForm open={open} onCancel={onCancel} isEdit={isEdit} />
    </Flex>
  );
};

export default Product;
