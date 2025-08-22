import {
  Modal,
  Input,
  List,
  Avatar,
  Tag,
  Typography,
  Empty,
  Checkbox,
  Radio,
} from "antd";
import {
  SearchOutlined,
  ShoppingOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAllProductsAsync } from "../../features/product/product.service";
import { ProductType } from "../../types/product.type";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import { setPost } from "../../features/post/selectedPost.slice";

const { Text, Title } = Typography;

interface ModalProductProps {
  open: boolean;
  onCancel: () => void;
}

const ModalProduct: React.FC<ModalProductProps> = ({ open, onCancel }) => {
  const selectedPost = useAppSelector((state: RootState) => state.selectedPost);
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    selectedPost.products
  );

  const [filterSelection, setFilterSelection] = useState<
    "all" | "selected" | "unselected"
  >("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products } = await getAllProductsAsync({
          search: searchText,
        });
        setProducts(products);
      } catch (error: any) {
        console.log(error);
      }
    };

    const timeout = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchText]);

  // Cập nhật selectedProducts khi selectedProducts thay đổi
  useEffect(() => {
    setSelectedProducts(selectedPost.products);
  }, [selectedPost.products]);

  const handleProductToggle = (product: ProductType) => {
    const isSelected = selectedProducts.some((_id) => _id === product._id);
    if (isSelected) {
      setSelectedProducts((prev) => prev.filter((_id) => _id !== product._id));
    } else {
      setSelectedProducts((prev) => [...prev, product._id]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Thêm tất cả products hiện tại vào selectedProducts (không trùng lặp)
      const newSelected = [...selectedProducts];
      filteredProducts.forEach((product) => {
        if (!newSelected.some((_id) => _id === product._id)) {
          newSelected.push(product._id);
        }
      });
      setSelectedProducts(newSelected);
    } else {
      // Bỏ chọn tất cả products hiện tại
      const currentIds = filteredProducts.map((p) => p._id);
      setSelectedProducts((prev) =>
        prev.filter((_id) => !currentIds.includes(_id))
      );
    }
  };

  const handleOk = () => {
    dispatch(setPost({ products: selectedProducts }));
    onCancel();
  };

  // Lọc sản phẩm theo search và filter selection
  const filteredProducts = products.filter((product) => {
    const isSelected = selectedProducts.some((_id) => _id === product._id);

    switch (filterSelection) {
      case "selected":
        return isSelected;
      case "unselected":
        return !isSelected;
      default:
        return true;
    }
  });

  const selectedCount = selectedProducts.length;
  const currentPageSelectedCount = filteredProducts.filter((product) =>
    selectedProducts.some((_id) => _id === product._id)
  ).length;
  const isAllCurrentPageSelected =
    filteredProducts.length > 0 &&
    currentPageSelectedCount === filteredProducts.length;
  const isIndeterminate =
    currentPageSelectedCount > 0 &&
    currentPageSelectedCount < filteredProducts.length;

  return (
    <Modal
      centered
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "18px",
            fontWeight: 600,
            color: "#1f2937",
          }}
        >
          <ShoppingOutlined style={{ color: "#1890ff" }} />
          Chọn sản phẩm ({selectedCount} đã chọn)
        </div>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose={true}
      width={800}
      okText={`Áp dụng (${selectedCount})`}
      cancelText="Hủy bỏ"
      okButtonProps={{
        style: {
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          border: "none",
          borderRadius: "8px",
          fontWeight: 500,
          height: "40px",
          paddingLeft: "24px",
          paddingRight: "24px",
        },
      }}
      cancelButtonProps={{
        style: {
          borderRadius: "8px",
          height: "40px",
          paddingLeft: "24px",
          paddingRight: "24px",
          borderColor: "#d1d5db",
        },
      }}
    >
      {/* Tìm kiếm */}
      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm sản phẩm theo tên..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        size="large"
        style={{ marginBottom: 16 }}
        allowClear
      />

      {/* Bộ lọc và chọn tất cả */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          padding: "12px 16px",
          background: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div>
          <Text style={{ marginRight: 12, fontWeight: 500 }}>Hiển thị:</Text>
          <Radio.Group
            value={filterSelection}
            onChange={(e) => setFilterSelection(e.target.value)}
            size="small"
          >
            <Radio.Button value="all">Tất cả ({products.length})</Radio.Button>
            <Radio.Button value="selected">
              <CheckCircleOutlined style={{ color: "#52c41a" }} /> Đã chọn (
              {selectedProducts.length})
            </Radio.Button>
            <Radio.Button value="unselected">
              <MinusCircleOutlined style={{ color: "#ff4d4f" }} /> Chưa chọn (
              {products.length - selectedProducts.length})
            </Radio.Button>
          </Radio.Group>
        </div>

        <Checkbox
          checked={isAllCurrentPageSelected}
          indeterminate={isIndeterminate}
          onChange={(e) => handleSelectAll(e.target.checked)}
        >
          Chọn tất cả trang này
        </Checkbox>
      </div>

      {/* Danh sách sản phẩm */}
      <div style={{ maxHeight: 500, overflowY: "auto" }}>
        {filteredProducts.length === 0 ? (
          <Empty
            description={
              filterSelection === "selected"
                ? "Chưa có sản phẩm nào được chọn"
                : filterSelection === "unselected"
                ? "Tất cả sản phẩm đã được chọn"
                : "Không tìm thấy sản phẩm nào"
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={filteredProducts}
            renderItem={(product) => {
              const isSelected = selectedProducts.some(
                (_id) => _id === product._id
              );
              return (
                <List.Item
                  key={product._id}
                  style={{
                    cursor: "pointer",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    border: `1px solid ${isSelected ? "#52c41a" : "#f0f0f0"}`,
                    backgroundColor: isSelected ? "#f6ffed" : "white",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "#f5f5f5";
                      e.currentTarget.style.borderColor = "#1890ff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isSelected
                      ? "#f6ffed"
                      : "white";
                    e.currentTarget.style.borderColor = isSelected
                      ? "#52c41a"
                      : "#f0f0f0";
                  }}
                  onClick={() => handleProductToggle(product)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      width: "100%",
                      gap: 12,
                    }}
                  >
                    <Checkbox checked={isSelected} style={{ marginTop: 8 }} />
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={product.image}
                          size={64}
                          shape="square"
                          style={{ borderRadius: "8px" }}
                        />
                      }
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Title
                            level={5}
                            style={{ margin: 0, color: "#262626" }}
                          >
                            {product.name}
                          </Title>
                          {product.link && (
                            <LinkOutlined
                              style={{ color: "#8c8c8c", fontSize: "12px" }}
                            />
                          )}
                          {isSelected && (
                            <CheckCircleOutlined
                              style={{ color: "#52c41a", fontSize: "16px" }}
                            />
                          )}
                        </div>
                      }
                      description={
                        <div>
                          <Text
                            ellipsis
                            type="secondary"
                            style={{ width: "70%", fontSize: "13px" }}
                          >
                            {product.description}
                          </Text>
                          <div
                            style={{
                              marginTop: 8,
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <Text
                              strong
                              style={{ color: "#ff4d4f", fontSize: "16px" }}
                            >
                              {product.price.toLocaleString("vi-VN")}đ
                            </Text>
                            <Tag color="blue" style={{ fontSize: "11px" }}>
                              {product.category}
                            </Tag>
                          </div>
                          {product.tags.length > 0 && (
                            <div style={{ marginTop: 6 }}>
                              {product.tags.slice(0, 3).map((tag: any) => (
                                <Tag
                                  key={tag}
                                  style={{ fontSize: "10px", marginRight: 4 }}
                                >
                                  {tag}
                                </Tag>
                              ))}
                              {product.tags.length > 3 && (
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "10px" }}
                                >
                                  +{product.tags.length - 3} thêm
                                </Text>
                              )}
                            </div>
                          )}
                        </div>
                      }
                    />
                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </div>

      {/* Thống kê */}
      <div
        style={{
          marginTop: 16,
          padding: "8px 12px",
          backgroundColor: "#f6f6f6",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <span>
          Hiển thị {filteredProducts.length} sản phẩm
          {searchText && ` cho "${searchText}"`}
        </span>
      </div>
    </Modal>
  );
};

export default ModalProduct;
