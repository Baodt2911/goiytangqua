import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommentType } from "../../types/comment.type";

type CommentState = {
  comments: CommentType[];
  loading: boolean;
  error: string | null;
};

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    // GET
    getCommentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCommentsSuccess: (state, action: PayloadAction<CommentType[]>) => {
      state.comments = action.payload;
      state.loading = false;
    },
    getCommentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

  // CREATE
    createComment: (state, action: PayloadAction<CommentType>) => {
      state.comments .push(action.payload);
    },

  },
});

export const {
  getCommentsStart,
  getCommentsSuccess,
  getCommentsFailure,
  createComment
} = commentSlice.actions;

export default commentSlice.reducer;
