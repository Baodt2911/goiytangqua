import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "../../types/post.type";
type PostState = {
  posts: PostType[];
  bestPosts: PostType[];
  loading: boolean;
  error: string | null;
};
const initialState: PostState = {
  posts: [],
  bestPosts: [],
  loading: false,
  error: null,
};
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // GET
    getPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPostsSuccess: (state, action: PayloadAction<PostType[]>) => {
      state.posts = action.payload;
      state.loading = false;
    },
    getPostsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // BEST POSTS
    getBestPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getBestPostsSuccess: (state, action: PayloadAction<PostType[]>) => {
      state.bestPosts = action.payload;
      state.loading = false;
    },
    getBestPostsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export const {
  getPostsStart,
  getPostsSuccess,
  getPostsFailure,
  getBestPostsStart,
  getBestPostsSuccess,
  getBestPostsFailure,
} = postSlice.actions;
export default postSlice.reducer;
