import axiosInstance from "../../configs/axios.config";

export const getCurrentUser = async () => {
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
