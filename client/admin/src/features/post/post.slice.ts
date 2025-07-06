import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type PostState = {
  title: string;
  content: string;
  slug: string;
  filters: Record<string, string>;
  products: string[];
  tags: string[];
};
const initialState: PostState = {
  title: "",
  content: "",
  slug: "",
  filters: {},
  products: [],
  tags: [],
};
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setDataPost: (state, action: PayloadAction<Partial<PostState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});
export const { setDataPost } = postSlice.actions;
export default postSlice.reducer;
