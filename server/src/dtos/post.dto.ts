import { Document } from "mongoose";
import { Post } from "src/types";

export type PostRequestDTO = Omit<Post, keyof Document>;
export type getAllPostRequestQueryDTO = {
  page: number;
  pageSize: number;
  tags: string;
};
