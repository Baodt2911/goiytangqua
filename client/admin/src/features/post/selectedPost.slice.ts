import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "../../types/post.type";
type PostState = PostType 
const initialState: PostState = {
  _id: "",
  title: "",
  content: "",
  thumbnail: "",
  description: "",
  slug: "",
  filters: {},
  products: [],
  tags: [],
  status: undefined,
  publishedAt: undefined,
  scheduledFor: undefined,
  views: 0,
  isFeatured: false,
  author: "",
  generatedBy: undefined,
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
