import axiosInstance from "../../configs/axios.config";

export const uploadImage = async (formData: any) => {
  const res = await axiosInstance.post(`/image/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteImage = async (public_id: string) => {
  const res = await axiosInstance.delete(`/image/delete/${public_id}`);
  return res.data;
};
