import axiosInstance from "../../configs/axios.config";
import { AIPrompt } from "../../types/ai_prompt.type";

export const getAllPromptsAsync = async () => {
  const res = await axiosInstance.get(`/prompt/all`);
  return res.data;
};

export const createPromptAsync = async (data: AIPrompt) => {
  const res = await axiosInstance.post("/prompt/create", data);
  return res.data;
};

export const deletePromptAsync = async (_id: string) => {
  const res = await axiosInstance.delete(`/prompt/delete/${_id}`);
  return res.data;
};

export const changeActivePromptAsync = async (
  _id: string,
  isActive: boolean
) => {
  const res = await axiosInstance.patch(`/prompt/change-active/${_id}`, {
    isActive,
  });
  return res.data;
};
export const updatePromptAsync = async (data: AIPrompt) => {
  const { _id, ...other } = data;
  const res = await axiosInstance.patch(`/prompt/update/${_id}`, other);
  return res.data;
};
