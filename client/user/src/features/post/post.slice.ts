import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "../../types/post.type";
type PostState = {
  posts: PostType[];
  loading: boolean;
  error: string | null;
};
const initialState: PostState = {
  posts: [],
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

    // CREATE
    createPost: (state, action: PayloadAction<PostType>) => {
      state.posts.push(action.payload);
    },

    // UPDATE
    updatePost: (state, action: PayloadAction<PostType>) => {
      const index = state.posts.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },

    // DELETE
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((p) => p._id !== action.payload);
    },
  },
});
export const {
  getPostsStart,
  getPostsSuccess,
  getPostsFailure,
  createPost,
  updatePost,
  deletePost,
} = postSlice.actions;
export default postSlice.reducer;
