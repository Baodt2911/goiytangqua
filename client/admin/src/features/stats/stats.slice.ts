import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getStatsAIAsync,
  getStatsOverviewAsync,
  getStatsPostAsync,
  getStatsActivitiesAsync,
  getStatsTopContentAsync,
} from "./stats.service";
import {
  StatsAIType,
  StatsOverviewType,
  StatsPostType,
  StatsActivitiesType,
  StatsTopContentType,
} from "../../types/stats.type";

// Tạo các thunk cho từng endpoint
export const fetchStatsAI = createAsyncThunk("stats/fetchAI", getStatsAIAsync);
export const fetchStatsOverview = createAsyncThunk(
  "stats/fetchOverview",
  getStatsOverviewAsync
);
export const fetchStatsPosts = createAsyncThunk(
  "stats/fetchPosts",
  getStatsPostAsync
);
export const fetchStatsActivities = createAsyncThunk(
  "stats/fetchActivities",
  getStatsActivitiesAsync
);
export const fetchStatsTopContent = createAsyncThunk(
  "stats/fetchTopContent",
  getStatsTopContentAsync
);
type BaseStatsType = {
  status: number;
};
type StatsState = {
  ai: { status: number; stats: StatsAIType | null };
  overview: { status: number; stats: StatsOverviewType | null };
  posts: { status: number; stats: StatsPostType[] | null };
  activities: { status: number; stats: StatsActivitiesType[] | null };
  topContent: { status: number; stats: StatsTopContentType[] | null };
  loading: boolean;
  error: string | null;
};
const initialState: StatsState = {
  ai: { status: 0, stats: null },
  overview: { status: 0, stats: null },
  posts: { status: 0, stats: null },
  activities: { status: 0, stats: null },
  topContent: { status: 0, stats: null },
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state: StatsState) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state: StatsState, action: any) => {
      state.loading = false;
      state.error = action.error.message;
    };

    builder
      .addCase(fetchStatsAI.pending, handlePending)
      .addCase(fetchStatsAI.fulfilled, (state, action) => {
        state.loading = false;
        state.ai = action.payload;
      })
      .addCase(fetchStatsAI.rejected, handleRejected)

      .addCase(fetchStatsOverview.pending, handlePending)
      .addCase(fetchStatsOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchStatsOverview.rejected, handleRejected)

      .addCase(fetchStatsPosts.pending, handlePending)
      .addCase(fetchStatsPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchStatsPosts.rejected, handleRejected)

      .addCase(fetchStatsActivities.pending, handlePending)
      .addCase(fetchStatsActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchStatsActivities.rejected, handleRejected)

      .addCase(fetchStatsTopContent.pending, handlePending)
      .addCase(fetchStatsTopContent.fulfilled, (state, action) => {
        state.loading = false;
        state.topContent = action.payload;
      })
      .addCase(fetchStatsTopContent.rejected, handleRejected);
  },
});

export default statsSlice.reducer;
