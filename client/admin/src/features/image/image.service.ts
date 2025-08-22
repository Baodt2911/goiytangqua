import axiosInstance from "../../configs/axios.config";
type OptionImage = {
  width: number;
  height: number;
  crop: "fill" | "fit" | "scale";
};

export const uploadImage = async (formData: any, options?: OptionImage) => {
  const res = await axiosInstance.post(`/image/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: options,
  });
  return res.data;
};

export const deleteImage = async (public_id: string) => {
  const res = await axiosInstance.delete(`/image/delete/${public_id}`);
  return res.data;
};
