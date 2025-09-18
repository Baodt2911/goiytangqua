import axiosInstance from "../../configs/axios.config";

export const getCommentsByPostIdAsync = async (postId: string) => {
  const res = await axiosInstance.get(`/post/${postId}/comments`,{
    headers: {
      "Skip-Auth": "true",
    },
  });
  return res.data;
};


export const createCommentAsync = async (postId: string, content: string) => {
  const res = await axiosInstance.post(`/post/${postId}/comment`, {content});
  return res.data;
};
