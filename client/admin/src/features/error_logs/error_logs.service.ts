import axiosInstance from "../../configs/axios.config";
export const getLogsAysnc = async ({ limit }: { limit: number }) => {
  const res = await axiosInstance.get(`/logs/errors?limit=${limit}`);
  return res.data;
};
