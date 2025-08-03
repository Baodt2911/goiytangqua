import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  EyeOutlined,
  MessageOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, List, message, Popconfirm, Space } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { useNavigate } from "react-router-dom";
import { setPost } from "../../features/post/selectedPost.slice";
import { PostType } from "../../types/post.stype";
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
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch(getPostsStart());
        const { posts, ...other } = await getAllPostAsync({});
        dispatch(getPostsSuccess(posts));
        // setCurrentPage(other.currentPage);
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
  }, [searchText]);

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
  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        loading={loading}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 9,
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
              {searchText && ` cho "${searchText}"`}
            </span>
          </div>
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
                text="156"
                key="list-vertical-like-o"
              />,
            ]}
          >
            <List.Item.Meta
              title={
                <a style={{ fontSize: 18, fontWeight: "bold" }} href={""}>
                  {post.title}
                </a>
              }
              description={post.slug}
            />
            <div
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
              style={{ lineHeight: "1.6", fontSize: "16px" }}
            />
            {}
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
