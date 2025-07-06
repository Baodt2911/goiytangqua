import axiosInstance from "../../configs/axios.config";

export const getFilters = async () => {
  const res = await axiosInstance.get("/filter");
  return res.data;
};

export const addFilter = async (filter: {
  type: string;
  options: string[];
}) => {
  const res = await axiosInstance.post("/filter/add", filter);
  return res.data;
};

export const deleteFilter = async (id: string) => {
  const res = await axiosInstance.delete(`/filter/delete/${id}`);
  return res.data;
};

export const updateFilter = async (
  id: string,
  filter: { type: string; options: string[] }
) => {
  const res = await axiosInstance.put(`/filter/update/${id}`, filter);
  return res.data;
};
