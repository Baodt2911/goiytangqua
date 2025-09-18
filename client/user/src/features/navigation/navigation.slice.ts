import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NavigationState = {
  currentPath: string;
};

const initialState: NavigationState = {
  currentPath: "",
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    clearCurrentPath: (state) => {
      state.currentPath = "";
    },
  },
});

export const { setCurrentPath, clearCurrentPath } = navigationSlice.actions;
export default navigationSlice.reducer;
