import axiosInstance from "../../configs/axios.config";
import { PostParamsType } from "../../types/post.type";

export const getAllPostAsync = async (params: Partial<PostParamsType>) => {
  const res = await axiosInstance.get(`/post/all`, {
    headers: {
      "Skip-Auth": "true",
    },
    params,
  });
  return res.data;
};

export const getPostBySlugAsync = async (slug: string) => {
  const res = await axiosInstance.get(`/post/slug/${slug}`,
    {
      headers: {
        "Skip-Auth": "true",
      },
    });
  return res.data;
};

export const getBestPostAsync = async () => {
  const res = await axiosInstance.get(`/post/best`,
    {
      headers: {
        "Skip-Auth": "true",
      },
    });
  return res.data;
};

export const increaseViewPostAsync = async (slug: string) => {
  const res = await axiosInstance.get(`/post/slug/${slug}/view`);
  return res.data;
};
