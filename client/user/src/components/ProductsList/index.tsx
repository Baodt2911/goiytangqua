import { useEffect } from "react";
import { Card, Col, Row, Button, List, Flex, Skeleton } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import {
  getProductsFailure,
  getProductsStart,
  getProductsSuccess,
} from "../../features/product/product.slice";
import { getAllProductsAsync } from "../../features/product/product.service";
const SkeletonListCard: React.FC = () => {
  return (
    <Row gutter={[16, 16]}>
      {Array.from({ length: 4 }, (_, index) => (
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
const ProductList = () => {
  const { loading, products } = useAppSelector(
    (state: RootState) => state.product
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(getProductsStart());
        const { products } = await getAllProductsAsync({
          pageSize: 8,
        });

        dispatch(getProductsSuccess(products));
      } catch (error: any) {
        console.log(error);
        dispatch(getProductsFailure(error.message));
      }
    };
    fetchProducts();
  }, []);
  return (
    <>
      {loading ? (
        <SkeletonListCard />
      ) : (
        <List
          style={{ width: "100%" }}
          grid={{ gutter: 16, column: 4 }}
          dataSource={products}
          loading={loading}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                cover={
                  <img
                    style={{ height: 240, objectFit: "cover" }}
                    alt={item.name}
                    src={item.image}
                  />
                }
              >
                <Card.Meta
                  title={item.name}
                  description={`Giá: ${item.price.toLocaleString()} VND`}
                />
                <Button
                  type="primary"
                  block
                  style={{ marginTop: "10px" }}
                  href={item.link}
                >
                  Xem chi tiết
                </Button>
              </Card>
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default ProductList;
