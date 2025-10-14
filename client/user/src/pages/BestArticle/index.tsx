import React, { useEffect, useMemo } from "react";
import { Typography, Alert, List, Grid } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { getBestPostAsync } from "../../features/post/post.service";
import {
  getBestPostsStart,
  getBestPostsSuccess,
  getBestPostsFailure,
} from "../../features/post/post.slice";
import PostCard from "../../components/PostCard";
import SkeletonPostCard from "../../components/SkeletonPostCard";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;
const BestArticlePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bestPosts, loading, error } = useAppSelector((state) => state.post);
  const screens = useBreakpoint();
  const isTabletOrMobile = useMemo(() => !screens.xl, [screens]);
  useEffect(() => {
    const fetchBestPosts = async () => {
      dispatch(getBestPostsStart());
      try {
        const { posts } = await getBestPostAsync();
        dispatch(getBestPostsSuccess(posts));
      } catch (error: any) {
        dispatch(
          getBestPostsFailure(
            error.message || "Có lỗi xảy ra khi tải bài viết tốt nhất"
          )
        );
      }
    };

    fetchBestPosts();
  }, [dispatch]);

  if (error) {
    return (
      <div style={{ padding: "40px 20px" }}>
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "35px 0",
        maxWidth: isTabletOrMobile ? "90%" : "50%",
        margin: "0 auto",
        background: "#f8f9fa",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "60px",
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <TrophyOutlined
          style={{
            fontSize: "48px",
            color: "#FF6B81",
            marginBottom: "16px",
          }}
        />
        <Title
          level={1}
          style={{
            color: "#333",
            marginBottom: "16px",
            fontFamily: "Oswald",
            textTransform: "uppercase",
          }}
        >
          Bài Viết Tốt Nhất
        </Title>
        <Paragraph
          style={{
            color: "#666",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Khám phá những bài viết được đánh giá cao nhất, được lựa chọn kỹ lưỡng
          để mang đến cho bạn những nội dung chất lượng và hữu ích nhất.
        </Paragraph>
      </div>

      {/* Posts Section */}
      {loading ? (
        <SkeletonPostCard count={10} />
      ) : (
        <List
          itemLayout="vertical"
          grid={{ gutter: 35, column: 1 }}
          dataSource={bestPosts}
          renderItem={(post) => (
            <List.Item key={post._id}>
              <PostCard post={post} />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default BestArticlePage;
