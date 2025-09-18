import { Button, Drawer, Flex, Layout, Space, Typography, Radio, Tooltip } from "antd";
const { Content } = Layout;
import { SearchOutlined } from "@ant-design/icons";
import GiftFilter from "../../components/GiftFilter";
import React, { useState } from "react";
import PostList from "../../components/PostsList";
import ProductList from "../../components/ProductsList";

const { Title } = Typography;

type SearchType = 'posts' | 'products';

const SuggestGift: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyWord] = useState<string>("");
  const [searchType, setSearchType] = useState<SearchType>('posts');
  const [isSearching, setIsSearching] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | string[]>>({});

  const handleSearch = () => {
    if (!keyword.trim() && Object.keys(appliedFilters).length === 0) {
      return;
    }
    setIsSearching(true);
  };

  const handleApplyFilters = (filters: Record<string, string | string[]>) => {
    setAppliedFilters(filters);
    setOpen(false);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setKeyWord("");
    setAppliedFilters({});
    setIsSearching(false);
  };
  return (
    <Content
      style={{
        marginTop: 50,
      }}
    >
      <Flex vertical={true} align="center" gap={"large"}>
        {/* Search Type Selector */}
        <Flex
          style={{
            width: "60%",
            padding: "20px",
            background: "#f8f9fa",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
          justify="center"
          align="center"
          gap="middle"
        >
          <Title level={5} style={{ margin: 0, fontFamily: "Oswald" }}>
            Tìm kiếm theo:
          </Title>
          <Radio.Group
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="posts" style={{ fontFamily: "Oswald" }}>
              Bài viết gợi ý
            </Radio.Button>
            <Radio.Button value="products" style={{ fontFamily: "Oswald" }}>
              Sản phẩm
            </Radio.Button>
          </Radio.Group>
        </Flex>

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
            placeholder={`Tìm kiếm ${searchType === 'posts' ? 'bài viết gợi ý' : 'sản phẩm'} ( vd: ${searchType === 'posts' ? 'Món quà tặng mẹ, Quà cho người yêu' : 'Điện thoại, Laptop, Quần áo'}, ... )`}
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
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />

          <Tooltip 
            title={searchType === 'products' ? "Sản phẩm chưa có bộ lọc nâng cao" : ""}
            placement="top"
          >
            <Button
              color="danger"
              variant="filled"
              style={{ fontFamily: "Oswald", padding: "20px 25px", fontSize: 16 }}
              onClick={() => setOpen(true)}
              disabled={searchType === 'products'}
            >
              Lọc nâng cao
            </Button>
          </Tooltip>
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            style={{ fontFamily: "Oswald", padding: "20px 25px" }}
            onClick={handleSearch}
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
          <GiftFilter 
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearSearch}
          />
        </Drawer>

        {/* Search Results or Default Content */}
        <Flex
          style={{
            width: "60%",
            marginTop: "50px",
          }}
          gap={"large"}
          vertical
        >
          {/* Show clear search button when searching */}
          {isSearching && (keyword || Object.keys(appliedFilters).length > 0) && (
            <Flex justify="space-between" align="center">
              <Title level={4} style={{ fontFamily: "Oswald", color: "#FF6B81" }}>
                Kết quả tìm kiếm {searchType === 'posts' ? 'bài viết' : 'sản phẩm'}
                {keyword && ` cho "${keyword}"`}
              </Title>
              <Button onClick={handleClearSearch} style={{ fontFamily: "Oswald" }}>
                Xóa tìm kiếm
              </Button>
            </Flex>
          )}

          {/* Conditional rendering based on search type */}
          {searchType === 'posts' ? (
            <>
              {!isSearching && (
                <Title level={4} style={{ fontFamily: "Oswald", color: "#FF6B81" }}>
                  Những gợi ý hay về các món quà
                </Title>
              )}
              <PostList 
                searchKeyword={isSearching ? keyword : undefined}
                filters={isSearching ? appliedFilters : undefined}
                isSearching={isSearching}
              />
            </>
          ) : (
            <>
              {!isSearching && (
                <Title level={4} style={{ fontFamily: "Oswald", color: "#FF6B81" }}>
                  Các sản phẩm được lựa chọn mua nhiều nhất
                </Title>
              )}
              <ProductList 
                searchKeyword={isSearching ? keyword : undefined}
                isSearching={isSearching}
              />
            </>
          )}

          {/* Show both when not searching */}
          {!isSearching && (
            <>
              {searchType === 'posts' ? (
                <>
                  <Title level={4} style={{ fontFamily: "Oswald", color: "#FF6B81" }}>
                    Các sản phẩm được lựa chọn mua nhiều nhất
                  </Title>
                  <ProductList />
                </>
              ) : (
                <>
                  <Title level={4} style={{ fontFamily: "Oswald", color: "#FF6B81" }}>
                    Những gợi ý hay về các món quà
                  </Title>
                  <PostList />
                </>
              )}
            </>
          )}
        </Flex>
      </Flex>
    </Content>
  );
};

export default SuggestGift;
