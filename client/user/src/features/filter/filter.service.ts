import axiosInstance from "../../configs/axios.config";

export const getFiltersAsync = async () => {
  const res = await axiosInstance.get(`/filter`);
  return res.data;
};
