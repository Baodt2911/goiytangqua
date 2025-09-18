import {
  Flex,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Avatar,
  Badge,
  Alert,
  Button,
  Space,
  Divider,
  Tag,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  FileTextOutlined,
  CommentOutlined,
  ShoppingOutlined,
  MessageOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import {
  fetchStatsActivities,
  fetchStatsAI,
  fetchStatsOverview,
  fetchStatsPosts,
  fetchStatsTopContent,
} from "../../features/stats/stats.slice";
import { formatTime } from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const getNameActivity = (type: string, data?: any) => {
  const nameActivity: any = {
    user: `${data?.name}`,
    post: "Bài viết mới",
    comment: "Bình luận mới",
    product: `Sản phẩm mới: ${data?.name}`,
  };
  return nameActivity[type];
};

const getActionActivity = (type: string, data?: any) => {
  const actionActivity: any = {
    user: "đăng ký tài khoản",
    post: `đã được tạo bởi ${data.generatedBy === "ai" ? "AI" : data.author}`,
    comment: `trên bài viết "${data?.postId?.title}"`,
    product: "đã được thêm vào cửa hàng",
  };
  return actionActivity[type];
};

const formatActivities = (activities: any[]) => {
  return activities.reduce((acc: any[], activity) => {
    acc.push({
      id: activity._id,
      type: activity.type,
      name: getNameActivity(activity.type, activity.data),
      action: getActionActivity(activity.type, activity.data),
      time: formatTime(activity.time),
    });
    return acc;
  }, []);
};

const getStatusPost = (status: string) => {
  const statusPost: any = {
    draft: "nháp",
    published: "đã xuất bản",
    scheduled: "đã lên lịch",
  };
  return statusPost[status];
};

const getColorPost = (status: string) => {
  const colorPost: any = {
    draft: "#faad14",
    published: "#1890ff",
    scheduled: "#52c41a",
  };
  return colorPost[status];
};
const DashBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { overview, posts, activities, topContent, loading } = useAppSelector(
    (state: RootState) => state.stats
  );
  const navigate = useNavigate();
  console.log(overview, posts, activities, topContent, loading);
  useEffect(() => {
    dispatch(fetchStatsOverview());
    dispatch(fetchStatsPosts());
    dispatch(fetchStatsAI());
    dispatch(fetchStatsActivities());
    dispatch(fetchStatsTopContent());
  }, [dispatch]);

  return (
    <Flex vertical style={{ width: "100%", padding: "24px" }} gap={24}>
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={2} style={{ margin: 0 }}>
          Dashboard - Bảng Điều Khiển
        </Title>
        <Space>
          <Button type="primary" icon={<CheckCircleOutlined />}>
            Duyệt Nội Dung
          </Button>
          <Button icon={<WarningOutlined />}>Xem Báo Cáo</Button>
        </Space>
      </Flex>

      {/* System Alerts */}
      <Alert
        message="Hệ thống hoạt động bình thường"
        type="success"
        showIcon
        closable
      />

      {/* Overview Statistics */}
      <Card title="Thống Kê Tổng Quan" loading={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Tổng Người Dùng"
                value={overview.stats?.total_user}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
              <Progress percent={75} size="small" showInfo={false} />
              <Text type="secondary">+12% so với tháng trước</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Bài Viết Nổi Bật"
                value={overview.stats?.total_post_featured}
                prefix={<EyeOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <Progress
                percent={60}
                size="small"
                showInfo={false}
                strokeColor="#1890ff"
              />
              <Text type="secondary">Được đánh dấu nổi bật</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Tổng Bài Viết"
                value={overview.stats?.total_post}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
              <Progress
                percent={85}
                size="small"
                showInfo={false}
                strokeColor="#722ed1"
              />
              <Text type="secondary">+8% tuần này</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Tổng Bình Luận"
                value={overview.stats?.total_comments}
                prefix={<CommentOutlined />}
                valueStyle={{ color: "#eb2f96" }}
              />
              <Progress
                percent={92}
                size="small"
                showInfo={false}
                strokeColor="#eb2f96"
              />
              <Text type="secondary">Tương tác cao</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Sản Phẩm"
                value={overview.stats?.total_products}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
              <Progress
                percent={45}
                size="small"
                showInfo={false}
                strokeColor="#fa8c16"
              />
              <Text type="secondary">Cửa hàng đang phát triển</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="Cuộc Trò Chuyện"
                value={overview.stats?.total_conversations}
                prefix={<MessageOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
              <Progress
                percent={68}
                size="small"
                showInfo={false}
                strokeColor="#52c41a"
              />
              <Text type="secondary">Cộng đồng sôi động</Text>
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Content Management */}
        <Col xs={24} lg={12}>
          <Card title="Quản Lý Nội Dung" loading={loading}>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              {posts.stats?.map((stat) => (
                <Flex justify="space-between" align="center" key={stat.status}>
                  <Text key={stat.status}>
                    Bài viết {getStatusPost(stat.status)}
                  </Text>
                  <Badge
                    count={stat.count}
                    style={{ backgroundColor: getColorPost(stat.status) }}
                  />
                </Flex>
              ))}
              <Divider />
              <Button
                type="primary"
                block
                icon={<CheckCircleOutlined />}
                onClick={() => navigate("/article/list-article")}
              >
                Quản Lý Bài Viết
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card title="Hoạt Động Gần Đây" loading={loading}>
            <List
              style={{ maxHeight: "350px", overflowY: "auto" }}
              itemLayout="horizontal"
              dataSource={formatActivities(activities.stats ?? [])}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={
                          item.type === "user" ? (
                            <UserOutlined />
                          ) : item.type === "post" ? (
                            <FileTextOutlined />
                          ) : item.type === "comment" ? (
                            <CommentOutlined />
                          ) : (
                            <ShoppingOutlined />
                          )
                        }
                        style={{
                          backgroundColor:
                            item.type === "user"
                              ? "#1890ff"
                              : item.type === "post"
                              ? "#722ed1"
                              : item.type === "comment"
                              ? "#eb2f96"
                              : "#fa8c16",
                        }}
                      />
                    }
                    title={<Text strong>{item.name}</Text>}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">{item.action}</Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          <ClockCircleOutlined /> {item.time}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Top Content */}
      <Card title="Nội Dung Được Quan Tâm Nhất" loading={loading}>
        <List
          itemLayout="horizontal"
          dataSource={topContent.stats || []}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Space key="totalInteractions">
                  <HeartOutlined />
                  <Text>{item.totalInteractions}</Text>
                </Space>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge
                    count={index + 1}
                    style={{ backgroundColor: "#faad14" }}
                  >
                    <Avatar
                      icon={<TrophyOutlined />}
                      style={{ backgroundColor: "#gold" }}
                    />
                  </Badge>
                }
                title={<Text strong>{item.title}</Text>}
                description={
                  <Space>
                    <Tag color="blue">Bài viết</Tag>
                    <Text type="secondary">
                      {item.totalInteractions} tương tác
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="Thao Tác Nhanh">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Button type="primary" block size="large" icon={<UserOutlined />}>
              Quản Lý Người Dùng
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              type="default"
              block
              size="large"
              icon={<FileTextOutlined />}
            >
              Tạo Thông Báo
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              type="default"
              block
              size="large"
              icon={<WarningOutlined />}
            >
              Báo Cáo Hệ Thống
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              type="default"
              block
              size="large"
              icon={<CheckCircleOutlined />}
            >
              Backup Dữ Liệu
            </Button>
          </Col>
        </Row>
      </Card>
    </Flex>
  );
};

export default DashBoard;
