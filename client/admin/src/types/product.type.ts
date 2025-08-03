export type ProductType = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  link: string;
  description: string;
  tags: string[];
  category: string;
};
export type ProductParamsType = {
  page: number;
  pageSize: number;
  category: string | undefined;
  min_price: number | undefined;
  max_price: number | undefined;
  tags: string | undefined;
  search: string | undefined;
  sort: string | undefined;
};
