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
import SkeletonPostCard from "../../components/SkeletonPostCard";

const Home: React.FC = () => {
  const { posts, loading } = useAppSelector((state: RootState) => state.post);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        dispatch(getPostsStart());
        const { posts } = await getAllPostAsync({
          pageSize: 10,
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
        <SkeletonPostCard count={10} />
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
