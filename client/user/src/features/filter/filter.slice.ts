import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterType } from "../../types/filter.type";

type FilterState = {
  filters: FilterType[];
  loading: boolean;
  error: string | null;
};

const initialState: FilterState = {
  filters: [], 
  loading: false,
  error: null,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // GET
    getFiltersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getFiltersSuccess: (state, action: PayloadAction<FilterType[]>) => {
      state.filters = action.payload;
      state.loading = false;
    },
    getFiltersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getFiltersStart,
  getFiltersSuccess,
  getFiltersFailure,

} = filterSlice.actions;

export default filterSlice.reducer;
