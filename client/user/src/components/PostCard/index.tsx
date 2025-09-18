import React from "react";
import { Typography, Tag, Space, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { PostType } from "../../types/post.type";
import dayjs from "dayjs";
import { getCloudinaryUrl } from "../../utils/image";

const { Text, Paragraph, Link } = Typography;

interface PostCardProps {
  post: PostType;
  isDetail?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isDetail = false }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/article/${post.slug}`);
  };

  const handleTagClick = (tag: string) => {
    navigate(`/article/tag/${encodeURIComponent(tag)}`);
  };

  return (
    <Flex
      vertical
      align="center"
      style={{ marginBottom: 48, maxWidth: "100%", background: "#fff" }}
    >
      <div
        onClick={handleReadMore}
        style={{
          width: "100%",
          height: 600,
          boxShadow: "0 5px 10px 0 #f5f5f5",
          cursor: "pointer",
        }}
      >
        <img
          style={{ width: "100%", height: "100%",objectFit:"contain" }}
          src={getCloudinaryUrl(post.thumbnail,{w:1200,h:600,c:"fill",q:100,f:"auto"})}
          alt={post.thumbnail}
        />
      </div>

      <Flex
        vertical
        style={{
          width: "70%",
          background: "#fff",
          transform: "translateY(-150px)",
          padding: "20px 50px",
        }}
      >
        <Space>
          <Link
            onClick={handleReadMore}
            style={{
              fontSize: 32,
              textTransform: "uppercase",
              fontFamily: "Oswald",
              fontWeight: 400,
              cursor: "pointer",
              color: "#333",
            }}
          >
            {post.title}
          </Link>
        </Space>

        <Space>
          <Text type="secondary" style={{ fontSize: 14, marginRight: 10 }}>
            <ClockCircleOutlined style={{ marginRight: 5 }} />
            {dayjs(post.publishedAt).format("DD/MM/YYYY")}
          </Text>
          <Text type="secondary" style={{ fontSize: 14 }}>
            <EyeOutlined style={{ marginRight: 5 }} /> {post.views} lượt xem
          </Text>
        </Space>

        {!isDetail ? (
          <Flex vertical gap={35} style={{ marginTop: 35 }}>
            {/* Mô tả bài viết */}
            <Paragraph
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: "#333",
                marginBottom: 24,
                textAlign: "justify",
              }}
            >
              {post.description || "Không có mô tả cho bài viết này."}
            </Paragraph>

            {/* Nút đọc thêm */}
            <Link onClick={handleReadMore} style={{ fontSize: 16 }} underline>
              Tiếp tục đọc
              <ArrowRightOutlined style={{ marginLeft: 10 }} />
            </Link>
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <Space wrap>
                  {post.tags.map((tag: string, index: number) => (
                    <Tag 
                      key={index} 
                      color="blue" 
                      style={{ cursor: "pointer" }}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </Flex>
        ) : (
          <div style={{ marginTop: 35 }}>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            {/* Tags for detail view */}
            {post.tags && post.tags.length > 0 && (
              <div style={{ marginTop: 30, marginBottom: 20 }}>
                <Space wrap>
                  {post.tags.map((tag: string, index: number) => (
                    <Tag 
                      key={index} 
                      color="blue" 
                      style={{ cursor: "pointer" }}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </div>
        )}
      </Flex>
    </Flex>
  );
};

export default PostCard;
