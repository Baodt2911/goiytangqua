import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../../types/product.type";
type ProductState = ProductType;
const initialState: ProductState = {
  _id: "",
  name: "",
  slug: "",
  price: 0,
  image: "",
  link: "",
  description: "",
  tags: [],
  category: "",
};
const selectedProductSlice = createSlice({
  name: "selectedProduct",
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<Partial<ProductState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    resetProduct: () => initialState,
  },
});
export const { setProduct, resetProduct } = selectedProductSlice.actions;
export default selectedProductSlice.reducer;
