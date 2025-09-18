import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/auth.slice";
import selectedPostSlice from "../features/post/selectedPost.slice";
import postSlice from "../features/post/post.slice";
import selectedProductSlice from "../features/product/selectedProduct.slice";
import productSlice from "../features/product/product.slice";
import selectedAIPromptSlice from "../features/ai_prompt/selectedAIPrompt.slice";
import aiPromptSlice from "../features/ai_prompt/ai_prompt.slice";
import scheduleSlice from "../features/schedule/schedule.slice";
import statsSlice from "../features/stats/stats.slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    selectedPost: selectedPostSlice,
    post: postSlice,
    selectedProduct: selectedProductSlice,
    product: productSlice,
    selectedAIPrompt: selectedAIPromptSlice,
    aiPrompt: aiPromptSlice,
    schedule: scheduleSlice,
    stats: statsSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
