import { ProductType } from "./product.type";

export type PostType = {
  _id: string | undefined;
  title: string;
  content: string;
  thumbnail: string;
  description?: string;
  slug: string;
  filters: Record<string, string>;
  products: ProductType[];
  tags: string[];
  status: "draft" | "published" | "scheduled" | undefined;
  publishedAt: Date | undefined;
  scheduledFor: Date | undefined;
  views: number;
  isFeatured: boolean;
  author: string;
  generatedBy: "human" | "ai" | "hybrid" | undefined;
};
export type PostParamsType = {
  page: number;
  pageSize: number;
  search: string | undefined;
  status: "draft" | "published" | "scheduled" | undefined;
  generatedBy: "human" | "ai" | "hybrid" | undefined;
  isFeatured: boolean;
  tags: string | undefined;
};
