import { Document } from "mongoose";
import { Product } from "src/types";

export type ProductRequestDTO = Omit<Product, keyof Document>;
export type getAllProductRequestQueryDTO = {
  page: number;
  pageSize: number;
  min_price: number;
  max_price: number;
  tags: string;
  category: string;
  sort: string;
  search: string;
};
