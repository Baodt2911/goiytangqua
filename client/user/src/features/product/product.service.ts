import axiosInstance from "../../configs/axios.config";
import { ProductParamsType } from "../../types/product.type";

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
