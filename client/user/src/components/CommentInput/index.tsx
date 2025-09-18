import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Input, Button, Form, Space, Avatar,App } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import {  AppDispatch } from "../../app/store";
import { createComment } from "../../features/comment/comment.slice";
import { createCommentAsync } from "../../features/comment/comment.service";
import { useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
const { TextArea } = Input;

const CommentInput: React.FC<{postId: string}> = ({postId}) => {
    const {message} = App.useApp();
  const dispatch = useDispatch<AppDispatch>();
   const {name} = useAppSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const handleSubmit = async (values: { content: string }) => {
    if (!values.content.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }

    try {
      setIsLoading(true);
      const data = await createCommentAsync(postId, values.content.trim());
      // Add new comment to existing comments array
      if (data.status >= 400) {
        setIsLoading(false);
        return message.warning(data.message);
      }
      dispatch(createComment({userId: {name: name! }, postId: postId, content: values.content.trim(), createdAt: new Date().toISOString()}));
    
      form.resetFields();
      message.success(data.message);
    } catch (error:any) {
      console.error("Error submitting comment:", error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 32, padding: 24, backgroundColor: "#fafafa", borderRadius: 8 }}>
      <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
        Để lại bình luận
      </h3>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Space align="start" style={{ width: "100%" }}>
            <Avatar style={{ background: "#FF6B81" }} size={40}>
            {name?.slice(0, 1)}
            </Avatar>
          <div style={{ flex: 1, width: "100%" }}>
            <Form.Item
              name="content"
              rules={[
                { required: true, message: "Vui lòng nhập nội dung bình luận" },
                { max: 500, message: "Bình luận không được quá 500 ký tự" },
              ]}
              style={{ marginBottom: 12 }}
            >
              <TextArea
                placeholder="Viết bình luận của bạn..."
                rows={4}
                cols={100}
                disabled={isLoading}
                showCount
                maxLength={500}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                icon={<SendOutlined />}
                style={{ borderRadius: 6 }}
              >
                Gửi bình luận
              </Button>
            </Form.Item>
          </div>
        </Space>
      </Form>
    </div>
  );
};

export default CommentInput;
