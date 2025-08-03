import { Document } from "mongoose";
import { Post } from "src/types";

export type PostRequestDTO = {
  title: string;
  thumbnail: string;
  slug: string;
  content: string;
  tags?: string[];
  filters?: Record<string, string>;
  products?: string[];
  author: string;
};
export type UpdatePostRequestDTO = {
  title: string;
  thumbnail: string;
  slug: string;
  content: string;
  tags: string[];
  filters: Record<string, string>;
  products: string[];
  status: "draft" | "published" | "scheduled";
  publishedAt: Date;
  scheduledFor: Date;
  isFeatured: boolean;
  author: string;
  aiPromptId: string;
};
export type getAllPostRequestQueryDTO = {
  page: number;
  pageSize: number;
  search: string;
  tags: string;
};
