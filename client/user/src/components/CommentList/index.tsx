import React from "react";
import { useSelector } from "react-redux";
import { List, Avatar, Typography, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { RootState } from "../../app/store";
import dayjs from "dayjs";
const { Text } = Typography;

const CommentList: React.FC = () => {
  const { comments, loading } = useSelector((state: RootState) => state.comment);

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
        Bình luận ({comments.length})
      </h3>
      <List
        loading={loading}
        dataSource={comments}
        locale={{ emptyText: "Chưa có bình luận nào" }}
        renderItem={(comment) => (
          <List.Item style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
            <List.Item.Meta
              avatar={
                <Avatar style={{ background: "#FF6B81" }} size={40}>
                {comment.userId.name?.slice(0, 1)}
                </Avatar>
              }
              title={
                <Space>
                  <Text strong>{comment.userId.name}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    lúc {dayjs(comment.createdAt).format("HH:mm DD/MM/YYYY")}
                  </Text>
                </Space>
              }
              description={
                <div style={{ marginTop: 8, lineHeight: 1.6 }}>
                  {comment.content}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default CommentList;
