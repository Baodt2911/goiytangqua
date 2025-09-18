import axiosInstance from "../../configs/axios.config";

export const getStatsAIAsync = async () => {
  const res = await axiosInstance.get(`/stats/ai`);
  return res.data;
};

export const getStatsOverviewAsync = async () => {
  const res = await axiosInstance.get(`/stats/overview`);
  return res.data;
};

export const getStatsPostAsync = async () => {
  const res = await axiosInstance.get(`/stats/posts`);
  return res.data;
};

export const getStatsActivitiesAsync = async () => {
  const res = await axiosInstance.get(`/stats/activities`);
  return res.data;
};

export const getStatsTopContentAsync = async () => {
  const res = await axiosInstance.get(`/stats/top-content`);
  return res.data;
};
