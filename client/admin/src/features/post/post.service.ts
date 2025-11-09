import { PostParamsType, PostType } from "../../types/post.type";
import axiosInstance from "../../configs/axios.config";
type PostCreateProps = Omit<
  PostType,
  | "_id"
  | "status"
  | "publishedAt"
  | "scheduledFor"
  | "views"
  | "isFeatured"
  | "author"
  | "generatedBy"
>;
type PostUpdateProps = Omit<
  PostType,
  "publishedAt" | "scheduledFor" | "views" | "generatedBy" | "isFeatured"
>;
export const getAllPostAsync = async (params: Partial<PostParamsType>) => {
  const res = await axiosInstance.get(`/post/all`, {
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

export const updatePostAsync = async (data: PostUpdateProps & { scheduledFor?: Date; publishedAt?: Date }) => {
  const { _id, ...other } = data;
  const res = await axiosInstance.patch(`/post/update/${_id}`, other);
  return res.data;
};
