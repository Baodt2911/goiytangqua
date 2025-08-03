import { PostType } from "./../../types/post.stype";
import axiosInstance from "../../configs/axios.config";
import { ProductParamsType } from "../../types/product.type";
type PostCreateProps = Omit<PostType, "_id" | "products"> & {
  products: string[];
};
type PostUpdateProps = Omit<PostType, "products"> & {
  products: string[];
};
export const getAllPostAsync = async (params: Partial<ProductParamsType>) => {
  const res = await axiosInstance.get(`/post/all`, {
    headers: {
      "Skip-Auth": "true",
    },
    params,
  });
  return res.data;
};

export const createPostAsync = async (data: PostCreateProps) => {
  const res = await axiosInstance.post("/post/create", data);
  return res.data;
};

export const deletePostAsync = async (_id: string) => {
  const res = await axiosInstance.delete(`/post/delete/${_id}`);
  return res.data;
};

export const updatePostAsync = async (data: PostUpdateProps) => {
  const { _id, ...other } = data;
  const res = await axiosInstance.patch(`/post/update/${_id}`, other);
  return res.data;
};
