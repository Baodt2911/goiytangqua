import axiosInstance from "../../configs/axios.config";
import { UserType } from "../../types/user.type";
type UserUpdateProps = Omit<UserType, "email">;
type ChangePasswordProps = {
  currentPassword: string;
  newPassword: string;
};
export const getCurrentUserAsync = async () => {
  try {
    const {
      data: { user },
    } = await axiosInstance.get("/user/me");
    return user;
  } catch (error) {
    console.error("Get current user failed:", error);
    return null;
  }
};
export const updateUserAsync = async (data: UserUpdateProps) => {
  try {
    const res = await axiosInstance.patch("/user/update-profile", data);
    return res.data;
  } catch (error) {
    console.error("Update user failed:", error);
    return null;
  }
};
export const changePasswordAsync = async (data: ChangePasswordProps) => {
  try {
    const res = await axiosInstance.post("/user/change-password", data);
    return res.data;
  } catch (error) {
    console.error("Change password failed:", error);
    return null;
  }
};
