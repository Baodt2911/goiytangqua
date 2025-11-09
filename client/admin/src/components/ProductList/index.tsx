import React, { useEffect, useState } from "react";
import type { PaginationProps } from "antd";
import { Row, Col, Skeleton, Flex, List } from "antd";
import ProductCard from "../ProductCard";
import { getAllProductsAsync } from "../../features/product/product.service";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  getProductsFailure,
  getProductsStart,
  getProductsSuccess,
} from "../../features/product/product.slice";
import ProductFilters, { ProductFiltersState } from "../ProductFilters";
import { RootState } from "../../app/store";

const SkeletonListCard: React.FC = () => {
  return (
    <Row gutter={[35, 35]}>
      {Array.from({ length: 8 }, (_, index) => (
        <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
          <Flex vertical gap={16}>
            <Skeleton.Image style={{ width: "100%", height: 300 }} />
            <Skeleton active />
          </Flex>
        </Col>
      ))}
    </Row>
  );
};
const ProductList: React.FC<{
  onOpenEditProduct: () => void;
  onOpenAddProduct: () => void;
}> = ({ onOpenEditProduct, onOpenAddProduct }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filters, setFilters] = useState<ProductFiltersState>({
    search: undefined,
    category: undefined,
    min_price: undefined,
    max_price: undefined,
    tags: undefined,
    sort: undefined,
  });
  const { loading, products } = useAppSelector(
    (state: RootState) => state.product
  );
  const dispatch = useAppDispatch();
  const onChangePage: PaginationProps["onChange"] = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filters: ProductFiltersState) => {
    setFilters(filters);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(getProductsStart());
        const { products, ...other } = await getAllProductsAsync({
          page: currentPage,
          pageSize: 8,
          ...filters,
        });

        dispatch(getProductsSuccess(products));
        setCurrentPage(other.currentPage);
        setTotalPage(other.totalPage);
      } catch (error: any) {
        console.log(error);
        dispatch(getProductsFailure(error.message));
      }
    };
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentPage, filters, dispatch]);
  return (
    <>
      <ProductFilters
        onOpenAddProduct={onOpenAddProduct}
        onFilterChange={handleFilterChange}
      />
      {loading ? (
        <SkeletonListCard />
      ) : (
        <List
          pagination={{
            onChange: onChangePage,
            pageSize: 8,
            align: "center",
            total: totalPage * 8,
          }}
          grid={{
            gutter: [35, 35],
            column: 4,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 4,
          }}
          dataSource={products}
          renderItem={(product) => (
            <List.Item>
              <ProductCard onOpenEditProduct={onOpenEditProduct} {...product} />
            </List.Item>
          )}
          locale={{
            emptyText: filters.search
              ? `Không tìm thấy sản phẩm cho "${filters.search}"`
              : "Không có sản phẩm nào",
          }}
        />
      )}
    </>
  );
};

export default ProductList;
