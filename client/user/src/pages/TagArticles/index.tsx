import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Typography, Empty, List, Grid } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { PostType } from "../../types/post.type";
import { getAllPostAsync } from "../../features/post/post.service";
import {
  getPostsStart,
  getPostsSuccess,
  getPostsFailure,
} from "../../features/post/post.slice";
import { RootState, AppDispatch } from "../../app/store";
import PostCard from "../../components/PostCard";
import SkeletonPostCard from "../../components/SkeletonPostCard";

const { Title } = Typography;
const { useBreakpoint } = Grid;
const TagArticles: React.FC = () => {
  const screens = useBreakpoint();

  const isTabletOrMobile = useMemo(() => !screens.xl, [screens]);

  const { tagName } = useParams<{ tagName: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [allPosts, setAllPosts] = useState<PostType[]>([]);

  const { posts, loading, error } = useSelector(
    (state: RootState) => state.post
  );

  useEffect(() => {
    const fetchPostsByTag = async () => {
      if (!tagName) return;

      try {
        dispatch(getPostsStart());
        const {
          posts: foundPosts,
          currentPage: page,
          totalPage: total,
        } = await getAllPostAsync({
          page: 1,
          pageSize: 10,
          tags: tagName,
        });

        dispatch(getPostsSuccess(foundPosts || []));
        setAllPosts(foundPosts || []);
        setCurrentPage(page || 1);
        setTotalPage(total || 1);
      } catch (error) {
        console.error("Error fetching posts by tag:", error);
        dispatch(getPostsFailure("Không thể tải bài viết"));
      }
    };

    // Reset state when tagName changes
    setAllPosts([]);
    setCurrentPage(1);
    setTotalPage(1);
    fetchPostsByTag();
  }, [tagName, dispatch]);

  const handleBack = () => {
    navigate("/");
  };

  const handleLoadMore = async () => {
    if (currentPage >= totalPage || loading) return;

    try {
      const {
        posts: morePosts,
        currentPage: page,
        totalPage: total,
      } = await getAllPostAsync({
        page: currentPage + 1,
        pageSize: 10,
        tags: tagName!,
      });

      const newAllPosts = [...allPosts, ...(morePosts || [])];
      setAllPosts(newAllPosts);
      dispatch(getPostsSuccess(newAllPosts));
      setCurrentPage(page || currentPage + 1);
      setTotalPage(total || totalPage);
    } catch (error) {
      console.error("Error loading more posts:", error);
      dispatch(getPostsFailure("Không thể tải thêm bài viết"));
    }
  };

  return (
    <div
      style={{
        padding: "35px 0",
        maxWidth: isTabletOrMobile ? "90%" : "50%",
        margin: "0 auto",
      }}
    >
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        style={{ marginBottom: 24 }}
      >
        Quay lại
      </Button>

      <Title level={2} style={{ marginBottom: 32, textAlign: "center" }}>
        Tag: {tagName}
      </Title>

      {loading && posts.length === 0 ? (
        <SkeletonPostCard count={10} />
      ) : posts.length === 0 ? (
        <Empty
          description="Không có bài viết nào với tag này"
          style={{ marginTop: 100 }}
        />
      ) : (
        <>
          <List
            itemLayout="vertical"
            grid={{ gutter: 35, column: 1 }}
            dataSource={posts}
            renderItem={(post) => (
              <List.Item key={post._id}>
                <PostCard post={post} isDetail={false} />
              </List.Item>
            )}
          />

          {currentPage < totalPage && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Button type="primary" onClick={handleLoadMore} loading={loading}>
                Xem thêm
              </Button>
            </div>
          )}

          {error && (
            <div
              style={{ marginTop: 16, color: "#ff4d4f", textAlign: "center" }}
            >
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TagArticles;
