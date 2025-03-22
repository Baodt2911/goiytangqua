import {
  Button,
  Checkbox,
  Flex,
  Radio,
  Select,
  Slider,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
const { Title } = Typography;
const GiftFilter: React.FC = () => {
  const [filters, setFilters] = useState({
    career: "",
    zodiac: "",
    interests: [],
    gender: "",
    occasion: "",
    ageRange: [18, 30],
    relationship: "",
    priceRange: [100000, 5000000],
    category: "",
    personality: "",
    trend: false,
  });
  const zodiacOptions = [
    { value: "aries", label: "Bạch Dương" },
    { value: "taurus", label: "Kim Ngưu" },
    { value: "gemini", label: "Song Tử" },
    { value: "cancer", label: "Cự Giải" },
    { value: "leo", label: "Sư Tử" },
    { value: "virgo", label: "Xử Nữ" },
    { value: "libra", label: "Thiên Bình" },
    { value: "scorpio", label: "Bọ Cạp" },
    { value: "sagittarius", label: "Nhân Mã" },
    { value: "capricorn", label: "Ma Kết" },
    { value: "aquarius", label: "Bảo Bình" },
    { value: "pisces", label: "Song Ngư" },
  ];

  const priceOptions = [
    { range: [0, 500000], label: "Dưới 500k" },
    { range: [500000, 1000000], label: "Từ 500k đến 1tr" },
    { range: [1000000, 2000000], label: "Từ 1tr đến 2tr" },
    { range: [2000000, 3000000], label: "Từ 2tr đến 3tr" },
    { range: [3000000, null], label: "Trên 3tr" },
  ];
  const handleChange = (
    field: string,
    value: string | number | boolean | []
  ) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    console.log(updatedFilters);
  };

  return (
    <Flex
      style={{
        width: "100%",
        padding: "50px",
        gap: 50,
      }}
      vertical
    >
      {/* Nhóm thông tin cá nhân */}
      <Flex style={{ width: "100%" }} gap={"middle"}>
        <Space direction="vertical" style={{ flex: 1 }}>
          <Title level={5}>Giới tính</Title>
          <Radio.Group
            name="gender"
            onChange={(e) => handleChange("gender", e.target.value)}
            options={[
              { value: "male", label: "Nam" },
              { value: "female", label: "Nữ" },
            ]}
          />
        </Space>

        <Space direction="vertical" style={{ flex: 1 }}>
          <Title level={5}>Tuổi</Title>
          <Slider
            range={{ draggableTrack: true }}
            defaultValue={[18, 30]}
            min={1}
            max={100}
            // onChange={(value) => handleChange("age", value)}
          />
        </Space>

        <Space direction="vertical" style={{ flex: 1 }}>
          <Title level={5}>Mối quan hệ</Title>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn mối quan hệ"
            onChange={(value) => handleChange("relationship", value)}
            // options={relationshipOptions}
          />
        </Space>

        <Space direction="vertical" style={{ flex: 1 }}>
          <Title level={5}>Dịp lễ</Title>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn dịp lễ"
            onChange={(value) => handleChange("relationship", value)}
            // options={relationshipOptions}
          />
        </Space>
      </Flex>

      {/* Nhóm sở thích và tính cách */}
      <Flex style={{ width: "100%" }} gap={"middle"}>
        <Space direction="vertical" style={{ flex: 2 }}>
          <Title level={5}>Sở thích</Title>
          <Select
            style={{ width: "100%" }}
            mode="tags"
            placeholder="Nhập sở thích"
            // options={hobbyOptions}
            onChange={(value) => handleChange("interests", value)}
            maxCount={10}
            showSearch
          />
        </Space>

        <Space direction="vertical" style={{ flex: 1 }}>
          <Title level={5}>Tính cách</Title>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn tính cách"
            onChange={(value) => handleChange("personality", value)}
            // options={personalityOptions}
          />
        </Space>

        <Space direction="vertical" style={{ flex: 1 }}>
          <Title level={5}>Cung hoàng đạo</Title>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn cung hoàng đạo"
            onChange={(value) => handleChange("zodiac", value)}
            options={zodiacOptions}
          />
        </Space>
      </Flex>

      {/* Nhóm quà tặng */}
      <Flex style={{ width: "100%" }} gap={"middle"}>
        <Space direction="vertical" style={{ flex: 1 }}>
          <Title level={5}>Giá trị quà tặng</Title>
          <Radio.Group
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontWeight: 500,
            }}
            onChange={(e) =>
              handleChange("priceRange", JSON.parse(e.target.value))
            }
            value={JSON.stringify(filters.priceRange)}
          >
            {priceOptions.map((option, index) => (
              <Radio key={index} value={JSON.stringify(option.range)}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </Space>

        <Space direction="vertical" style={{ flex: 1 }}>
          <Title level={5}>Trend</Title>
          <Flex vertical gap={10}>
            <Checkbox
              onChange={(e) => handleChange("trend", e.target.checked)}
              style={{ fontWeight: 500 }}
            >
              Theo xu hướng
            </Checkbox>
          </Flex>
        </Space>

        <Space direction="vertical" style={{ flex: 1 }}>
          <Title level={5}>Loại quà</Title>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn loại quà"
            onChange={(value) => handleChange("giftType", value)}
            // options={giftOptions}
          />
        </Space>
      </Flex>

      {/* Hành động       */}
      <Flex style={{ width: "100%" }} justify="right">
        <Space>
          <Button
            type="primary"
            style={{ fontFamily: "Oswald", padding: "20px 25px", fontSize: 16 }}
          >
            Áp dụng bộ lọc
          </Button>
        </Space>
      </Flex>
    </Flex>
  );
};

export default GiftFilter;
