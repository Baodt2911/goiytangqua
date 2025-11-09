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
  Dropdown,
  DatePicker,
  TimePicker,
} from "antd";
import type { MenuProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { useNavigate } from "react-router-dom";
import { setPost } from "../../features/post/selectedPost.slice";
import { PostType } from "../../types/post.type";
import {
  deletePostAsync,
  getAllPostAsync,
  updatePostAsync,
} from "../../features/post/post.service";
import {
  deletePost,
  getPostsFailure,
  getPostsStart,
  getPostsSuccess,
  updatePost,
} from "../../features/post/post.slice";
import { RootState } from "../../app/store";
import PostFilters, { PostFiltersState } from "../../components/PostFilters";

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
const getStatusLabel = (
  status: "draft" | "published" | "scheduled" | undefined
) => {
  switch (status) {
    case "draft":
      return "Nháp";
    case "published":
      return "Đã xuất bản";
    case "scheduled":
      return "Đã lên lịch";
    default:
      return "Nháp";
  }
};

const getAvailableStatusOptions = (
  currentStatus: "draft" | "published" | "scheduled" | undefined
): MenuProps["items"] => {
  const options: MenuProps["items"] = [];

  if (currentStatus === "draft") {
    options.push(
      {
        key: "published",
        label: "Xuất bản",
      },
      {
        key: "scheduled",
        label: "Lên lịch",
      }
    );
  } else if (currentStatus === "published") {
    options.push(
      {
        key: "draft",
        label: "Nháp",
      },
      {
        key: "scheduled",
        label: "Lên lịch",
      }
    );
  } else if (currentStatus === "scheduled") {
    options.push(
      {
        key: "edit-schedule",
        label: "Chỉnh sửa lịch",
      },
      {
        type: "divider",
      },
      {
        key: "draft",
        label: "Nháp",
      },
      {
        key: "published",
        label: "Đã xuất bản",
      }
    );
  }

  return options;
};
const Posts: React.FC = () => {
  const { posts, loading } = useAppSelector((state: RootState) => state.post);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filters, setFilters] = useState<PostFiltersState>({
    search: undefined,
    status: undefined,
    generatedBy: undefined,
    isFeatured: false,
  });
  const [schedulingPostId, setSchedulingPostId] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<Record<string, { date: Dayjs | null; time: Dayjs | null }>>({});
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
        setTotalPage(other.totalPage);
      } catch (error: any) {
        console.log(error);
        dispatch(getPostsFailure(error.message));
      }
    };
    const timeout = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(timeout);
  }, [filters, currentPage, dispatch]);

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
  const handleChangeStatusPost = async (
    post: PostType,
    value: "draft" | "published" | "scheduled",
    scheduledFor?: Date
  ) => {
    try {
      const updateData = { ...post, status: value };

      // Handle scheduledFor
      if (value === "scheduled" && scheduledFor) {
        updateData.scheduledFor = scheduledFor;
      } else if (value !== "scheduled") {
        updateData.scheduledFor = undefined;
      }

      // Handle publishedAt - update when changing to published
      if (value === "published") {
        updateData.publishedAt = new Date();
      }

      const data = await updatePostAsync(updateData);
      if (data.status >= 400) {
        return message.warning(data.message);
      }

      // Convert Date to ISO string for Redux (serializable)
      const updatedPost = {
        ...post,
        status: value,
        scheduledFor: scheduledFor ? scheduledFor.toISOString() : undefined,
        publishedAt:
          value === "published" ? new Date().toISOString() : post.publishedAt,
      };
      dispatch(updatePost(updatedPost as PostType));
      message.success(data.message);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    }
  };

  const handleStatusMenuClick = (post: PostType, key: string, e: any) => {
    e?.domEvent?.stopPropagation?.();
    if (key === "scheduled" || key === "edit-schedule") {
      // Open scheduling dropdown
      setSchedulingPostId(post._id || null);
      // Initialize schedule data if not exists
      if (!scheduleData[post._id || ""]) {
        let initialDate: Dayjs;
        let initialTime: Dayjs;
        
        if (post.scheduledFor) {
          // Parse scheduledFor - could be string (ISO) or Date
          const scheduledDate = typeof post.scheduledFor === 'string' 
            ? dayjs(post.scheduledFor) 
            : dayjs(post.scheduledFor);
          initialDate = scheduledDate;
          initialTime = scheduledDate;
        } else {
          // Default to tomorrow at 00:00
          const tomorrow = dayjs().add(1, "day").startOf("day");
          initialDate = tomorrow;
          initialTime = tomorrow;
        }
        
        setScheduleData({
          ...scheduleData,
          [post._id || ""]: { date: initialDate, time: initialTime },
        });
      }
    } else {
      handleChangeStatusPost(post, key as "draft" | "published" | "scheduled");
    }
  };

  const handleScheduleConfirm = (post: PostType) => {
    const postId = post._id || "";
    const schedule = scheduleData[postId];
    
    if (!schedule || !schedule.date || !schedule.time) {
      message.warning("Vui lòng chọn ngày và giờ");
      return;
    }

    // Combine date and time
    const scheduledDateTime = schedule.date
      .hour(schedule.time.hour())
      .minute(schedule.time.minute())
      .second(0)
      .millisecond(0);

    if (scheduledDateTime.isBefore(dayjs())) {
      message.warning("Thời gian lên lịch phải trong tương lai");
      return;
    }

    handleChangeStatusPost(post, "scheduled", scheduledDateTime.toDate());
    setSchedulingPostId(null);
  };

  const handleScheduleCancel = () => {
    setSchedulingPostId(null);
  };

  const renderScheduleDropdown = (post: PostType) => {
    const postId = post._id || "";
    let schedule = scheduleData[postId];
    
    // Initialize if not exists
    if (!schedule) {
      let initialDate: Dayjs;
      let initialTime: Dayjs;
      
      if (post.scheduledFor) {
        // Parse scheduledFor - could be string (ISO) or Date
        const scheduledDate = typeof post.scheduledFor === 'string' 
          ? dayjs(post.scheduledFor) 
          : dayjs(post.scheduledFor);
        initialDate = scheduledDate;
        initialTime = scheduledDate;
      } else {
        // Default to tomorrow at 00:00
        const tomorrow = dayjs().add(1, "day").startOf("day");
        initialDate = tomorrow;
        initialTime = tomorrow;
      }
      
      schedule = { date: initialDate, time: initialTime };
      // Update state asynchronously
      setScheduleData({
        ...scheduleData,
        [postId]: schedule,
      });
    }

    return (
      <div
        style={{
          padding: "16px",
          minWidth: 400,
          backgroundColor: "#fff",
          borderRadius: "6px",
          border: "1px solid #d9d9d9",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div style={{ marginBottom: "12px", color: "#666", fontSize: "14px" }}>
          Đặt lịch chuyển sang chế độ công khai
        </div>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space>
            <DatePicker
              value={schedule.date}
              onChange={(date) => {
                setScheduleData({
                  ...scheduleData,
                  [postId]: { ...schedule, date },
                });
              }}
              format="DD/MM/YYYY"
              style={{ width: 200 }}
              placeholder="Chọn ngày"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
            <TimePicker
              value={schedule.time}
              onChange={(time) => {
                setScheduleData({
                  ...scheduleData,
                  [postId]: { ...schedule, time },
                });
              }}
              format="HH:mm"
              style={{ width: 120 }}
              placeholder="Chọn giờ"
            />
          </Space>
          <div style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
            Bài viết sẽ ở chế độ riêng tư trước khi xuất bản
          </div>
          <Space style={{ justifyContent: "flex-end", width: "100%", marginTop: "8px" }}>
            <Button size="small" onClick={handleScheduleCancel}>
              Hủy
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => handleScheduleConfirm(post)}
            >
              Lên lịch
            </Button>
          </Space>
        </Space>
      </div>
    );
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
          total: totalPage * 8,
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
                icon={EyeOutlined}
                text={post?.views?.toString()}
                key="list-vertical-like-o"
              />,
              <Dropdown
                menu={{
                  items: getAvailableStatusOptions(post.status),
                  onClick: ({ key, domEvent }) => handleStatusMenuClick(post, key, { domEvent }),
                }}
                trigger={["click"]}
                key={`status-dropdown-${post._id}`}
                open={schedulingPostId === post._id ? true : undefined}
                onOpenChange={(open) => {
                  if (!open && schedulingPostId === post._id) {
                    setSchedulingPostId(null);
                  }
                }}
                dropdownRender={(menu) => {
                  if (schedulingPostId === post._id) {
                    return renderScheduleDropdown(post);
                  }
                  return <>{menu}</>;
                }}
                overlayStyle={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  padding: 0,
                }}
              >
                <Button
                  style={{ width: 120, border: "none", boxShadow: "none" }}
                >
                  {getStatusLabel(post.status)} <DownOutlined />
                </Button>
              </Dropdown>,
            ]}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Typography.Link
                href={"https://www.goiytangqua.site/article/" + post.slug}
                style={{ margin: 0 }}
                target="_blank"
              >
                <h4>{post.title}</h4>
              </Typography.Link>

              <Typography.Link
                href={"https://www.goiytangqua.site/article/" + post.slug}
                type="secondary"
                target="_blank"
              >
                {post.slug}
              </Typography.Link>

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
