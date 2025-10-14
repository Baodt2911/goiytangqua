import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, List, Grid } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { PostType } from "../../types/post.type";
import {
  getPostBySlugAsync,
  increaseViewPostAsync,
} from "../../features/post/post.service";
import { getCommentsByPostIdAsync } from "../../features/comment/comment.service";
import {
  getCommentsStart,
  getCommentsSuccess,
  getCommentsFailure,
} from "../../features/comment/comment.slice";
import { RootState, AppDispatch } from "../../app/store";
import PostCard from "../../components/PostCard";
import CommentList from "../../components/CommentList";
import CommentInput from "../../components/CommentInput";
import { getCloudinaryUrl } from "../../utils/image";
import SkeletonPostCard from "../../components/SkeletonPostCard";
import { useAppSelector } from "../../app/hook";

const { useBreakpoint } = Grid;
const Article: React.FC = () => {
  const screens = useBreakpoint();
  const isTabletOrMobile = useMemo(() => !screens.xl, [screens]);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  // Redux state for comments
  const { error } = useSelector((state: RootState) => state.comment);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const { post: foundPost } = await getPostBySlugAsync(slug);

        if (foundPost) {
          setPost(foundPost);
        } else {
          navigate("/");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/");
        setLoading(false);
      }
    };

    const fetchIncreaseViewPost = async () => {
      try {
        if (!slug) return;
        await increaseViewPostAsync(slug);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    if (slug) {
      fetchPost();
      fetchIncreaseViewPost();
    }
  }, [slug, navigate]);

  const handleBack = () => {
    navigate("/");
  };

  // Fetch comments when post is loaded
  useEffect(() => {
    const fetchComments = async () => {
      if (!post?._id) return;

      try {
        dispatch(getCommentsStart());
        const { comments } = await getCommentsByPostIdAsync(post._id);
        dispatch(getCommentsSuccess(comments));
      } catch (error) {
        console.error("Error fetching comments:", error);
        dispatch(getCommentsFailure("Không thể tải bình luận"));
      }
    };

    if (post) {
      fetchComments();
    }
  }, [post, dispatch]);

  const hasProducts =
    !!post && Array.isArray(post.products) && post.products.length > 0;

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
      {loading ? (
        <SkeletonPostCard count={1} />
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={hasProducts ? 18 : 24}>
            <PostCard post={post!} isDetail={true} />

            {/* Comments Section */}
            <div style={{ marginTop: 48 }}>
              {isAuthenticated && <CommentInput postId={post?._id || ""} />}
              <CommentList />
              {error && (
                <div
                  style={{
                    marginTop: 16,
                    color: "#ff4d4f",
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          </Col>
          {hasProducts && (
            <Col
              xs={24}
              md={6}
              style={{ backgroundColor: "#fff", padding: 24 }}
            >
              <div
                style={{
                  position: "sticky",
                  top: 24,
                  borderLeft: "1px solid #f0f0f0",
                  paddingLeft: 16,
                }}
              >
                <h3 style={{ marginBottom: 12 }}>Sản phẩm gợi ý</h3>
                <List
                  dataSource={post!.products}
                  renderItem={(item) => (
                    <List.Item style={{ padding: "8px 0" }}>
                      <div style={{ display: "flex", gap: 12, width: "100%" }}>
                        <img
                          alt={item.name}
                          src={getCloudinaryUrl(item.image, {
                            w: 72,
                            h: 72,
                            c: "fill",
                          })}
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: 6,
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              marginBottom: 4,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={item.name}
                          >
                            {item.name}
                          </div>
                          <div style={{ color: "#fa541c", fontWeight: 600 }}>
                            {item.price.toLocaleString()} VND
                          </div>
                          <div style={{ marginTop: 6 }}>
                            <Button
                              size="small"
                              type="link"
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              style={{ padding: 0 }}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export default Article;
