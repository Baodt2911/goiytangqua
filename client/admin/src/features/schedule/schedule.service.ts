import axiosInstance from "../../configs/axios.config";
import { ContentSchedule } from "../../types/schedule.type";

export const getScheduleAsync = async (aiPromptId: string) => {
  const res = await axiosInstance.get(`/content-schedule/${aiPromptId}`);
  return res.data;
};

export const createScheduleAsync = async (data: ContentSchedule) => {
  const res = await axiosInstance.post("/content-schedule/create", data);
  return res.data;
};

export const deleteScheduleAsync = async (_id: string) => {
  const res = await axiosInstance.delete(`/content-schedule/delete/${_id}`);
  return res.data;
};

export const updateScheduleAsync = async (data: ContentSchedule) => {
  const { _id, ...other } = data;
  const res = await axiosInstance.patch(
    `/content-schedule/update/${_id}`,
    other
  );
  return res.data;
};
