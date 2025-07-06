import React from "react";
import { Flex, Select, Space, Typography } from "antd";
const { Title } = Typography;
const PostInfor = () => {
  return (
    <Flex style={{ width: "100%" }} gap={"middle"}>
      <Space direction="vertical" style={{ flex: 2 }}>
        <Title level={5}>Bộ lọc</Title>
        <Select
          style={{ width: "100%" }}
          mode="tags"
          placeholder="Bộ lọc"
          // options={hobbyOptions}
          maxCount={10}
          showSearch
        />
      </Space>

      <Space direction="vertical" style={{ flex: 2 }}>
        <Title level={5}>Tags</Title>
        <Select
          style={{ width: "100%" }}
          mode="tags"
          placeholder="Tags"
          // options={hobbyOptions}
          maxCount={10}
          showSearch
        />
      </Space>
    </Flex>
  );
};

export default PostInfor;
