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

    // CREATE
    createProduct: (state, action: PayloadAction<ProductType>) => {
      state.products.push(action.payload);
    },

    // UPDATE
    updateProduct: (state, action: PayloadAction<ProductType>) => {
      const index = state.products.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },

    // DELETE
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
  },
});
export const {
  getProductsStart,
  getProductsSuccess,
  getProductsFailure,
  createProduct,
  updateProduct,
  deleteProduct,
} = productSlice.actions;
export default productSlice.reducer;
