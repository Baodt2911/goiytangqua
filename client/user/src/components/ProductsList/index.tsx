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
import { getCloudinaryUrl } from "../../utils/image";
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
interface ProductListProps {
  searchKeyword?: string;
  isSearching?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ searchKeyword, isSearching }) => {
  const { loading, products } = useAppSelector(
    (state: RootState) => state.product
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(getProductsStart());
        
        // Build search parameters
        const searchParams: any = {
          pageSize: 8,
        };
        
        if (searchKeyword) {
          searchParams.search = searchKeyword;
        }

        const { products } = await getAllProductsAsync(searchParams);
        dispatch(getProductsSuccess(products));
      } catch (error: any) {
        console.log(error);
        dispatch(getProductsFailure(error.message));
      }
    };
    fetchProducts();
  }, [searchKeyword, isSearching, dispatch]);
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
          locale={{ emptyText: "Không có sản phẩm nào liên quan đến tìm kiếm của bạn." }}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                cover={
                  <img
                    style={{ height: 240, objectFit: "cover" }}
                    alt={item.name}
                    src={getCloudinaryUrl(item.image,{h:240,c:"fill",q:100})}
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
