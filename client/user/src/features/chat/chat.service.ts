import axiosInstance from "../../configs/axios.config";

export const getAllConversationsAsync = async () => {
  const res = await axiosInstance.get(`/chat/conversations`);
  return res.data;
};

export const getMessagesConversationAsync = async (_id: string) => {
  const res = await axiosInstance.get(`/chat/conversations/${_id}`);
  return res.data;
};
