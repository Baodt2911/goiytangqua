import React, { useEffect } from "react";
import { Skeleton, Col, Row, Flex, List } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  getPostsStart,
  getPostsSuccess,
  getPostsFailure,
} from "../../features/post/post.slice";
import { getAllPostAsync } from "../../features/post/post.service";
import { RootState } from "../../app/store";
import PostCard from "../../components/PostCard";

const SkeletonPostCard: React.FC = () => {
  return (
    <Row gutter={[35, 35]}>
      {Array.from({ length: 4 }, (_, index) => (
        <Col key={index} span={24}>
          <Flex vertical gap={16} style={{ background: "#fff" }}>
            <Skeleton.Image style={{ width: "100%", height: 400 }} />
            <div
              style={{
                width: "70%",
                margin: "0 auto",
                background: "#fff",
                transform: "translateY(-150px)",
                padding: "20px 50px",
                minHeight: 200,
              }}
            >
              <Skeleton active />
            </div>
          </Flex>
        </Col>
      ))}
    </Row>
  );
};

const Home: React.FC = () => {
  const { posts, loading } = useAppSelector((state: RootState) => state.post);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        dispatch(getPostsStart());
        const { posts } = await getAllPostAsync({
          pageSize: 10,
          status: "published",
        });
        dispatch(getPostsSuccess(posts));
      } catch (error: any) {
        console.log(error);
        dispatch(getPostsFailure(error.message));
      }
    };

    fetchFeaturedPosts();
  }, [dispatch]);

  return (
    <div
      style={{
        padding: "35px 0",
        maxWidth: "50%",
        margin: "0 auto",
      }}
    >
      {loading ? (
        <SkeletonPostCard />
      ) : (
        <List
          style={{ width: "100%" }}
          grid={{ gutter: 35, column: 1 }}
          dataSource={posts}
          loading={loading}
          renderItem={(post) => (
            <List.Item>
              <PostCard post={post} />
            </List.Item>
          )}
          locale={{ emptyText: "Không có bài viết nổi bật nào để hiển thị" }}
        />
      )}
    </div>
  );
};

export default Home;
