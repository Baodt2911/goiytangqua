import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = (): "light" | "dark" => {
  const storedTheme = localStorage.getItem("theme");
  return storedTheme === "dark" ? "dark" : "light";
};

type ThemeState = {
  mode: "light" | "dark";
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
