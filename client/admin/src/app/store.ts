import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/auth.slice";
import selectedPostSlice from "../features/post/selectedPost.slice";
import postSlice from "../features/post/post.slice";
import selectedProductSlice from "../features/product/selectedProduct.slice";
import productSlice from "../features/product/product.slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    selectedPost: selectedPostSlice,
    post: postSlice,
    selectedProduct: selectedProductSlice,
    product: productSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
