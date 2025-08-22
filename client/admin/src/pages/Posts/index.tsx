import React, { useEffect, useState } from "react";
import {
  List,
  Button,
  Popconfirm,
  Typography,
  Image,
  Space,
  message,
  PaginationProps,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { useNavigate } from "react-router-dom";
import { setPost } from "../../features/post/selectedPost.slice";
import { PostType } from "../../types/post.type";
import {
  deletePostAsync,
  getAllPostAsync,
} from "../../features/post/post.service";
import {
  deletePost,
  getPostsFailure,
  getPostsStart,
  getPostsSuccess,
} from "../../features/post/post.slice";
import { RootState } from "../../app/store";
import PostFilters, { PostFiltersState } from "../../components/PostFilters";

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const Posts: React.FC = () => {
  const { posts, loading } = useAppSelector((state: RootState) => state.post);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPage, setTotalPage] = useState(1);
  const [filters, setFilters] = useState<PostFiltersState>({
    search: undefined,
    status: undefined,
    generatedBy: undefined,
    isFeatured: false,
  });
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch(getPostsStart());
        const { posts, ...other } = await getAllPostAsync({
          page: currentPage,
          pageSize: 8,
          ...filters,
        });

        dispatch(getPostsSuccess(posts));
        setCurrentPage(other.currentPage);
        // setTotalPage(other.totalPage);
      } catch (error: any) {
        console.log(error);
        dispatch(getPostsFailure(error.message));
      }
    };
    const timeout = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(timeout);
  }, [filters]);

  const onChangePage: PaginationProps["onChange"] = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditPost = (post: PostType) => {
    dispatch(setPost(post));
    navigate("/article/writing");
  };

  const handleDeletePost = async (_id: string) => {
    try {
      const data = await deletePostAsync(_id);
      if (data.status >= 400) {
        return message.warning(data.message);
      }
      dispatch(deletePost(_id));
      message.success(data.message);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    }
  };
  const handleFilterChange = (filters: PostFiltersState) => {
    setFilters(filters);
  };
  return (
    <>
      <PostFilters onFilterChange={handleFilterChange} />
      <List
        itemLayout="vertical"
        size="large"
        loading={loading}
        pagination={{
          onChange: onChangePage,
          pageSize: 8,
          align: "center",
        }}
        grid={{
          gutter: [35, 35],
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        header={<h2>Danh sách bài viết</h2>}
        footer={
          posts.length === 0 ? (
            <></>
          ) : (
            <div
              style={{
                marginTop: 16,
                padding: "8px 12px",
                backgroundColor: "#f6f6f6",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#666",
              }}
            >
              <span style={{ fontSize: 16 }}>
                Hiển thị {posts.length}/{posts.length} bài viết
                {filters.search && ` cho "${filters.search}"`}
              </span>
            </div>
          )
        }
        dataSource={posts}
        renderItem={(post) => (
          <List.Item
            style={{
              padding: 20,
            }}
            key={post.title}
            actions={[
              <Button
                type="text"
                icon={<EditOutlined key="edit" />}
                onClick={() => handleEditPost(post)}
              />,
              <Popconfirm
                title="Bạn có chắc muốn xoá bài viết này?"
                onConfirm={() => handleDeletePost(post._id as string)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button type="text" icon={<DeleteOutlined key="delete" />} />
              </Popconfirm>,
              <IconText
                icon={MessageOutlined}
                text="2"
                key="list-vertical-message"
              />,
              <IconText
                icon={EyeOutlined}
                text="123"
                key="list-vertical-like-o"
              />,
            ]}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {post.title}
              </Typography.Title>

              <Typography.Text type="secondary">{post.slug}</Typography.Text>

              <div style={{ width: "50%" }}>
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                    }}
                  >
                    goiytangqua
                  </div>
                )}
              </div>

              {post.description && (
                <Typography.Paragraph
                  style={{
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {post.description}
                </Typography.Paragraph>
              )}
            </Space>
          </List.Item>
        )}
        locale={{
          emptyText: "Không có bài viết nào",
        }}
      />
    </>
  );
};

export default Posts;
