export type PostRequestDTO = {
  title: string;
  thumbnail?: string;
  description?: string;
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
  description: string;
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
  isFeatured: boolean;
  generatedBy: "human" | "ai" | "hybrid";
  tags: string;
  filters?: Record<string, string>;
};
