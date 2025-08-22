import { ProductType } from "./product.type";

export type PostType = {
  _id: string | undefined;
  title: string;
  content: string;
  slug: string;
  filters: Record<string, string>;
  products: ProductType[];
  tags: string[];
};
