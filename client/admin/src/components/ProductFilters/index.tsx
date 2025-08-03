import React, { useState } from "react";
import {
  Input,
  Select,
  Row,
  Col,
  Space,
  Typography,
  InputNumber,
  Card,
  Button,
  Flex,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ProductParamsType } from "../../types/product.type";

const { Option } = Select;
const { Text } = Typography;

export type ProductFiltersState = Omit<ProductParamsType, "page" | "pageSize">;

interface ProductFiltersProps {
  onFilterChange: (filters: ProductFiltersState) => void;
  onOpenAddProduct: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  onOpenAddProduct,
}) => {
  const [filters, setFilters] = useState<ProductFiltersState>({
    search: undefined,
    category: undefined,
    min_price: undefined,
    max_price: undefined,
    tags: undefined,
    sort: undefined,
  });

  const handleChange = (key: keyof ProductFiltersState, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const handlePriceChange = (
    type: "min_price" | "max_price",
    value: number | null
  ) => {
    // Validate price range
    if (
      type === "min_price" &&
      filters.max_price &&
      value &&
      value > filters.max_price
    ) {
      return;
    }
    if (
      type === "max_price" &&
      filters.min_price &&
      value &&
      value < filters.min_price
    ) {
      return;
    }
    handleChange(type, value || undefined);
  };

  const clearAllFilters = () => {
    const clearedFilters: ProductFiltersState = {
      search: undefined,
      category: undefined,
      min_price: undefined,
      max_price: undefined,
      tags: undefined,
      sort: undefined,
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const setPriceRange = (min: number | undefined, max: number | undefined) => {
    const updated = { ...filters, min_price: min, max_price: max };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  return (
    <Card
      size="small"
      title={
        <Space>
          <FilterOutlined />
          <Text strong>Bộ lọc sản phẩm</Text>
        </Space>
      }
      extra={
        <Flex gap={"large"}>
          <Button
            type="link"
            onClick={clearAllFilters}
            size="small"
            style={{ padding: 0 }}
          >
            Xóa tất cả
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onOpenAddProduct}
            size="small"
          >
            Thêm sản phẩm
          </Button>
        </Flex>
      }
      style={{ marginBottom: 16 }}
    >
      <Row gutter={[16, 16]}>
        {/* Search & Sort */}
        <Col xs={24} sm={12} md={8}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Tìm kiếm
              </Text>
              <Input
                placeholder="Nhập tên sản phẩm..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => handleChange("search", e.target.value)}
                allowClear
                style={{ marginTop: 4 }}
              />
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Sắp xếp
              </Text>
              <Select
                placeholder="Chọn cách sắp xếp"
                value={filters.sort}
                onChange={(value: string) => handleChange("sort", value)}
                style={{ width: "100%", marginTop: 4 }}
                allowClear
              >
                <Option value="price_asc">Giá: Thấp đến cao</Option>
                <Option value="price_desc">Giá: Cao đến thấp</Option>
                <Option value="name_asc">Tên: A đến Z</Option>
                <Option value="name_desc">Tên: Z đến A</Option>
                <Option value="newest">Mới nhất</Option>
                <Option value="oldest">Cũ nhất</Option>
              </Select>
            </div>
          </Space>
        </Col>

        {/* Category & Tags */}
        <Col xs={24} sm={12} md={8}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Loại
              </Text>
              <Input
                placeholder="Nhập loại sản phẩm..."
                value={filters.category}
                onChange={(e) => handleChange("category", e.target.value)}
                allowClear
                style={{ marginTop: 4 }}
              />
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Tags
              </Text>
              <Select
                mode="tags"
                placeholder="Nhập hoặc chọn tags"
                value={filters.tags?.split(",")}
                onChange={(value: string[]) =>
                  handleChange("tags", value.join(","))
                }
                style={{ width: "100%", marginTop: 4 }}
                allowClear
                tokenSeparators={[","]}
              >
                <Option value="hot">Hot</Option>
                <Option value="sale">Sale</Option>
                <Option value="new">Mới</Option>
                <Option value="popular">Phổ biến</Option>
              </Select>
            </div>
          </Space>
        </Col>

        {/* Price Range */}
        <Col xs={24} sm={24} md={8}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Khoảng giá
              </Text>
              <Space.Compact style={{ width: "100%", marginTop: 4 }}>
                <InputNumber
                  placeholder="Từ"
                  min={0}
                  max={999999999}
                  value={filters.min_price}
                  onChange={(value) => handlePriceChange("min_price", value)}
                  formatter={(value) =>
                    value
                      ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                  parser={(value) =>
                    value ? parseInt(value.replace(/\$\s?|(,*)/g, ""), 10) : 0
                  }
                  style={{ width: "50%" }}
                  controls={false}
                />
                <InputNumber
                  placeholder="Đến"
                  min={filters.min_price || 0}
                  max={999999999}
                  value={filters.max_price}
                  onChange={(value) => handlePriceChange("max_price", value)}
                  formatter={(value) =>
                    value
                      ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                  parser={(value) =>
                    value ? parseInt(value.replace(/\$\s?|(,*)/g, ""), 10) : 0
                  }
                  style={{ width: "50%" }}
                  controls={false}
                />
              </Space.Compact>
              <Text
                type="secondary"
                style={{ fontSize: "11px", marginTop: 4, display: "block" }}
              >
                Đơn vị: VNĐ
              </Text>
            </div>

            {/* Quick price filters */}
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Lọc nhanh
              </Text>
              <Space wrap style={{ marginTop: 4 }}>
                <Button
                  type="link"
                  size="small"
                  onClick={() => setPriceRange(undefined, 100000)}
                  style={{ fontSize: "11px", padding: 0, height: "auto" }}
                >
                  &lt; 100K
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => setPriceRange(100000, 500000)}
                  style={{ fontSize: "11px", padding: 0, height: "auto" }}
                >
                  100K - 500K
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => setPriceRange(500000, undefined)}
                  style={{ fontSize: "11px", padding: 0, height: "auto" }}
                >
                  &gt; 500K
                </Button>
              </Space>
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductFilters;
