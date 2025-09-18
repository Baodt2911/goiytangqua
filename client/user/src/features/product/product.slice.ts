import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../../types/product.type";
type ProductState = {
  products: ProductType[];
  loading: boolean;
  error: string | null;
};
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // GET
    getProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getProductsSuccess: (state, action: PayloadAction<ProductType[]>) => {
      state.products = action.payload;
      state.loading = false;
    },
    getProductsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

  },
});
export const {
  getProductsStart,
  getProductsSuccess,
  getProductsFailure,
} = productSlice.actions;
export default productSlice.reducer;
