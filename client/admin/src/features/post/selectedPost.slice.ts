import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "../../types/post.stype";
type PostState = PostType;
const initialState: PostState = {
  _id: "",
  title: "",
  content: "",
  slug: "",
  filters: {},
  products: [],
  tags: [],
};
const selectedPostSlice = createSlice({
  name: "selectedPost",
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<Partial<PostState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    resetPost: () => initialState,
  },
});
export const { setPost, resetPost } = selectedPostSlice.actions;
export default selectedPostSlice.reducer;
