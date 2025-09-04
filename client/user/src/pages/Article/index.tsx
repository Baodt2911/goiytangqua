import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { PostType } from "../../types/post.type";
import {
  getPostBySlugAsync,
  increaseViewPostAsync,
} from "../../features/post/post.service";
import PostCard from "../../components/PostCard";

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, [slug]);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div style={{ padding: "35px 0", width: "50%", margin: "0 auto" }}>
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        style={{ marginBottom: 24 }}
      >
        Quay lại
      </Button>
      {loading ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <PostCard post={post!} isDetail={true} />
      )}
    </div>
  );
};

export default Article;
