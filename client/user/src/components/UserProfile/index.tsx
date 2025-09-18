import React, { useState } from "react";
import { Form, Input, Select, DatePicker, Button, Space, Tag, App } from "antd";
import { SaveOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { UserType } from "../../types/user.type";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import {
  changePasswordAsync,
  updateUserAsync,
} from "../../features/user/user.service";
import { setUser } from "../../features/user/user.slice";

const { Option } = Select;

const UserProfile: React.FC = () => {
  const { message } = App.useApp();
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);
  const [editingPassword, setEditingPassword] = useState<boolean>(false);

  const handleUpdateProfile = async (values: UserType) => {
    try {
      const { email, birthday, ...other } = values;
      setIsLoading(true);

      const formattedData = {
        ...other,
        ...(birthday && { birthday: dayjs(birthday).format("YYYY/MM/DD") }),
      };

      const data = await updateUserAsync(formattedData);
      if (data.status >= 400) {
        setIsLoading(false);
        return message.warning(data.message);
      }
      dispatch(setUser({ email, ...formattedData }));
      setEditingProfile(false);
      message.success(data.message);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
      setIsLoading(false);
    }
  };
  const handleChangePassword = async (values: any) => {
    try {
      setIsLoading(true);
      const data = await changePasswordAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (data.status >= 400) {
        setIsLoading(false);
        return message.warning(data.message);
      }
      message.success(data.message);
      setEditingPassword(false);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20, color: "#333" }}>Thông tin người dùng</h2>

      {/* --- Profile Info --- */}
      {!editingProfile ? (
        <div style={{ marginBottom: 30 }}>
          <p>
            <strong>Họ tên: </strong> {user.name || "------"}
          </p>
          <p>
            <strong>Email: </strong> {user.email || "-------"}
          </p>
          <p>
            <strong>Giới tính: </strong>
            {user.gender?.toLocaleUpperCase("vi") || "----"}
          </p>
          <p>
            <strong>Ngày sinh: </strong>
            {user.birthday
              ? dayjs(user.birthday).format("DD/MM/YYYY")
              : "DD/MM/YYYY"}
          </p>
          <p>
            <strong>Sở thích: </strong>
            {user.preferences?.map((item) => (
              <Tag color={"magenta"} key={item} style={{ borderRadius: 999 }}>
                {item}
              </Tag>
            )) || "-----"}
          </p>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setEditingProfile(true)}
          >
            Sửa hồ sơ
          </Button>
        </div>
      ) : (
        <Form
          layout="vertical"
          form={form}
          style={{ marginBottom: 30 }}
          onFinish={handleUpdateProfile}
          initialValues={{
            ...user,
            birthday: user.birthday ? dayjs(user.birthday) : undefined,
          }}
        >
          <Form.Item name="name" label="Họ tên">
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email bắt buộc" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính">
            <Select placeholder="Chọn giới tính">
              <Option value="nam">Nam</Option>
              <Option value="nữ">Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item name="birthday" label="Ngày sinh">
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="preferences" label="Sở thích">
            <Select mode="tags" placeholder="Nhập/Chọn sở thích" />
          </Form.Item>

          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
            >
              Lưu
            </Button>
            <Button onClick={() => setEditingProfile(false)}>Hủy</Button>
          </Space>
        </Form>
      )}

      {/* --- Password --- */}
      <h3 style={{ marginBottom: 15, color: "#444" }}>Mật khẩu</h3>
      {!editingPassword ? (
        <div>
          <p>********</p>
          <Button
            icon={<LockOutlined />}
            onClick={() => setEditingPassword(true)}
          >
            Đổi mật khẩu
          </Button>
        </div>
      ) : (
        <Form
          layout="vertical"
          style={{ marginTop: 10 }}
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("currentPassword") === value) {
                    return Promise.reject(
                      new Error(
                        "Mật khẩu mới không được trùng với mật khẩu hiện tại!"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp với mật khẩu mới!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
            />
          </Form.Item>

          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
            >
              Lưu
            </Button>
            <Button onClick={() => setEditingPassword(false)}>Hủy</Button>
          </Space>
        </Form>
      )}
    </div>
  );
};
export default UserProfile;
