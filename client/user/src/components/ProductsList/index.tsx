import { useState, useEffect } from "react";
import { Card, Col, Row, Button } from "antd";
const mockProducts = [
  {
    _id: "1",
    name: "Đồng hồ thông minh Xiaomi",
    slug: "dong-ho-thong-minh-xiaomi",
    price: 1599000,
    image: "https://placehold.co/150",
    link: "https://example.com/product/xiaomi-watch",
    description: "Đồng hồ thông minh với nhiều tính năng theo dõi sức khỏe.",
    tags: ["công nghệ", "xiaomi", "đồng hồ"],
    category: "công nghệ",
  },
  {
    _id: "2",
    name: "Balo du lịch chống nước",
    slug: "balo-du-lich-chong-nuoc",
    price: 499000,
    image: "https://placehold.co/150",
    link: "https://example.com/product/balo-du-lich",
    description: "Balo dung tích lớn, phù hợp cho các chuyến đi dài ngày.",
    tags: ["du lịch", "balo", "phụ kiện"],
    category: "du lịch",
  },
  {
    _id: "3",
    name: "Tai nghe Bluetooth Sony",
    slug: "tai-nghe-bluetooth-sony",
    price: 1999000,
    image: "https://placehold.co/150",
    link: "https://example.com/product/sony-earbuds",
    description: "Tai nghe không dây với chất lượng âm thanh đỉnh cao.",
    tags: ["tai nghe", "sony", "công nghệ"],
    category: "công nghệ",
  },
  {
    _id: "4",
    name: "Sách 'Dám Bị Ghét'",
    slug: "sach-dam-bi-ghet",
    price: 129000,
    image: "https://placehold.co/150",
    link: "https://example.com/product/dam-bi-ghet",
    description: "Cuốn sách truyền cảm hứng về tâm lý và phát triển bản thân.",
    tags: ["sách", "phát triển bản thân"],
    category: "sách",
  },
  {
    _id: "5",
    name: "Bộ mỹ phẩm chăm sóc da",
    slug: "bo-my-pham-cham-soc-da",
    price: 599000,
    image: "https://placehold.co/150",
    link: "https://example.com/product/my-pham",
    description: "Bộ mỹ phẩm giúp làm sáng da và ngăn ngừa lão hóa.",
    tags: ["mỹ phẩm", "chăm sóc da"],
    category: "làm đẹp",
  },
];

const ProductList = () => {
  const [products, setProducts] = useState(mockProducts);

  return (
    <div>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Card
              hoverable
              cover={<img alt={product.name} src={product.image} />}
            >
              <Card.Meta
                title={product.name}
                description={`Giá: ${product.price.toLocaleString()} VND`}
              />
              <Button
                type="primary"
                block
                style={{ marginTop: "10px" }}
                href={product.link}
              >
                Xem chi tiết
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;
