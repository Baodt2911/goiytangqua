import axiosInstance from "../../configs/axios.config";

export const getStatsOverviewAIAsync = async () => {
  const res = await axiosInstance.get(`/stats/overview/ai`);
  return res.data;
};
