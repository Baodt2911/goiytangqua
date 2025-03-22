import React from "react";
import { Card, List, Typography } from "antd";

const { Paragraph, Title } = Typography;

// Mock data
const mockPosts = [
  {
    _id: "1",
    title: "Top 10 món quà tặng bạn gái ý nghĩa nhất",
    slug: "top-10-mon-qua-tang-ban-gai",
    content:
      "Chọn quà tặng bạn gái chưa bao giờ dễ dàng hơn với danh sách này...",
    tags: ["quà tặng", "bạn gái", "tình yêu"],
    filters: { "giới tính": "nữ", "mối quan hệ": "người yêu" },
    products: ["650d5f78c5b8f20b4c9a2e1a", "650d5f78c5b8f20b4c9a2e1b"],
  },
  {
    _id: "2",
    title: "5 món quà sinh nhật dành cho nam giới",
    slug: "5-mon-qua-sinh-nhat-nam-gioi",
    content: "Những món quà phù hợp nhất dành cho các chàng trai...",
    tags: ["quà tặng", "nam giới", "sinh nhật"],
    filters: { "giới tính": "nam", "mối quan hệ": "bạn bè" },
    products: ["650d5f78c5b8f20b4c9a2e1c", "650d5f78c5b8f20b4c9a2e1d"],
  },
  {
    _id: "3",
    title: "Món quà ý nghĩa cho cha mẹ",
    slug: "mon-qua-y-nghia-cho-cha-me",
    content: "Những gợi ý giúp bạn chọn quà cho cha mẹ một cách ý nghĩa...",
    tags: ["gia đình", "cha mẹ", "quà tặng"],
    filters: { "mối quan hệ": "bố mẹ", "dịp lễ": "ngày của cha mẹ" },
    products: ["650d5f78c5b8f20b4c9a2e1e", "650d5f78c5b8f20b4c9a2e1f"],
  },
  {
    _id: "4",
    title: "Gợi ý quà Valentine cho người yêu",
    slug: "goi-y-qua-valentine",
    content:
      "Ngày lễ tình nhân đang đến gần, đây là những món quà tuyệt vời...",
    tags: ["Valentine", "quà tặng", "người yêu"],
    filters: { "mối quan hệ": "người yêu", "dịp lễ": "Valentine" },
    products: ["650d5f78c5b8f20b4c9a2e20", "650d5f78c5b8f20b4c9a2e21"],
  },
  {
    _id: "5",
    title: "Quà tặng doanh nhân - Sang trọng và đẳng cấp",
    slug: "qua-tang-doanh-nhan",
    content: "Lựa chọn quà tặng phù hợp cho đối tác, khách hàng và sếp...",
    tags: ["doanh nhân", "công việc", "quà tặng"],
    filters: { "nghề nghiệp": "doanh nhân", "mối quan hệ": "đối tác" },
    products: ["650d5f78c5b8f20b4c9a2e22", "650d5f78c5b8f20b4c9a2e23"],
  },
];

const PostList: React.FC = () => {
  return (
    <List
      style={{ width: "100%" }}
      grid={{ gutter: 16, column: 2 }}
      dataSource={mockPosts}
      renderItem={(item) => (
        <List.Item>
          <Card
            hoverable
            cover={
              <img
                alt={item.title}
                src={"https://placehold.co/150"}
                style={{ height: 150, objectFit: "cover" }}
              />
            }
          >
            <Title level={4}>{item.title}</Title>
            <Paragraph>{item.content}</Paragraph>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default PostList;
