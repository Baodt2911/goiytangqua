import { Button, Drawer, Flex, Layout, Space, Typography } from "antd";
const { Content } = Layout;
import { SearchOutlined } from "@ant-design/icons";
import GiftFilter from "../../components/GiftFilter";
import React, { useState } from "react";
import PostList from "../../components/PostsList";
import ProductList from "../../components/ProductsList";
// import PostList from "../../components/Posts";
const { Title } = Typography;
const Home: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyWord] = useState<string>("");
  return (
    <Content
      style={{
        marginTop: 50,
      }}
    >
      <Flex vertical={true} align="center" gap={"large"}>
        {/* Search */}
        <Flex
          gap={"middle"}
          align="center"
          style={{
            width: "60%",
            boxShadow: "0 5px 10px 0 #e9e9e9",
            padding: "0 25px 0 0",
            background: "#fff",
          }}
        >
          <input
            placeholder="Tìm kiếm thông minh ( vd: Món quà tặng mẹ, Quà cho người yêu, Sở thích, ... )"
            style={{
              width: "100%",
              height: 60,
              padding: "35px 50px",
              fontSize: 18,
              fontFamily: "Oswald",
              border: "none",
              outline: "none",
            }}
            value={keyword}
            onChange={(e) => setKeyWord(e.target.value)}
          />

          <Button
            color="danger"
            variant="filled"
            style={{ fontFamily: "Oswald", padding: "20px 25px", fontSize: 16 }}
            onClick={() => setOpen(true)}
          >
            Lọc nâng cao
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            style={{ fontFamily: "Oswald", padding: "20px 25px" }}
          >
            Tìm kiếm
          </Button>
        </Flex>
        {/* Từ khóa  */}
        <Flex
          style={{
            width: "60%",
            padding: "0 20px",
          }}
          align="center"
          gap={"large"}
          wrap={true}
        >
          <Title style={{ fontFamily: "Oswald" }} level={5}>
            Từ khóa đề xuất:
          </Title>
          <Space size={"large"} wrap={true}>
            <Button
              color="primary"
              variant="outlined"
              style={{ fontFamily: "Oswald" }}
              size="large"
              onClick={() => setKeyWord("Món quà tặng mẹ")}
            >
              Món quà tặng mẹ
            </Button>
            <Button
              color="primary"
              variant="outlined"
              style={{ fontFamily: "Oswald" }}
              size="large"
              onClick={() => setKeyWord("Quà sinh nhật bạn thân")}
            >
              Quà sinh nhật bạn thân
            </Button>
            <Button
              color="primary"
              variant="outlined"
              style={{ fontFamily: "Oswald" }}
              size="large"
              onClick={() => setKeyWord("Quà tặng người yêu")}
            >
              Quà tặng người yêu
            </Button>
            <Button
              color="primary"
              variant="outlined"
              style={{ fontFamily: "Oswald" }}
              size="large"
              onClick={() => setKeyWord("Cầu lông")}
            >
              Cầu lông
            </Button>
            <Button
              color="primary"
              variant="outlined"
              style={{ fontFamily: "Oswald" }}
              size="large"
              onClick={() => setKeyWord("Công nghệ thông tin")}
            >
              Công nghệ thông tin
            </Button>
            <Button
              color="primary"
              variant="outlined"
              style={{ fontFamily: "Oswald" }}
              size="large"
              onClick={() => setKeyWord("Cung nhân mã")}
            >
              Cung nhân mã
            </Button>
          </Space>
        </Flex>
        {/* Filter  */}
        <Drawer
          title={<Title level={3}>Bộ lọc nâng cao</Title>}
          placement={"right"}
          closable={false}
          onClose={() => setOpen(false)}
          open={open}
          key={"right"}
          width={"50%"}
        >
          <GiftFilter />
        </Drawer>
        <Flex
          style={{
            width: "60%",
            marginTop: "50px",
          }}
          gap={"large"}
          vertical
        >
          <Title level={4} style={{ fontFamily: "Oswald", color: "#FF6B81" }}>
            Những gợi ý hay về các món quà
          </Title>
          <PostList />
          <Title level={4} style={{ fontFamily: "Oswald", color: "#FF6B81" }}>
            Các sản phẩm được lựa chọn mua nhiều nhất
          </Title>
          <ProductList />
        </Flex>
      </Flex>
    </Content>
  );
};

export default Home;
