import axiosInstance from "../../configs/axios.config";
import { PostParamsType } from "../../types/post.type";

export const getAllPostAsync = async (params: Partial<PostParamsType>) => {
  const res = await axiosInstance.get(`/post/all`, {
    params,
  });
  return res.data;
};

export const getPostBySlugAsync = async (slug: string) => {
  const res = await axiosInstance.get(`/post/slug/${slug}`);
  return res.data;
};

export const increaseViewPostAsync = async (slug: string) => {
  const res = await axiosInstance.get(`/post/slug/${slug}/view`);
  return res.data;
};
