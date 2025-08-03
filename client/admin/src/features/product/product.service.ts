import axiosInstance from "../../configs/axios.config";
import { ProductParamsType, ProductType } from "../../types/product.type";

export const getAllProductsAsync = async (
  params: Partial<ProductParamsType>
) => {
  const res = await axiosInstance.get(`/product/all`, {
    headers: {
      "Skip-Auth": "true",
    },
    params,
  });
  return res.data;
};

export const createProductAsync = async (data: ProductType) => {
  const res = await axiosInstance.post("/product/create", data);
  return res.data;
};

export const deleteProductAsync = async (_id: string) => {
  const res = await axiosInstance.delete(`/product/delete/${_id}`);
  return res.data;
};

export const updateProductAsync = async (data: ProductType) => {
  const { _id, ...other } = data;
  const res = await axiosInstance.patch(`/product/update/${_id}`, other);
  return res.data;
};
