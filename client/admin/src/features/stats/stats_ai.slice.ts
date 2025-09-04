import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type StatsAIState = {
  total_prompt: number;
  active_prompt: number;
  paused_prompt: number;
  total_schedule: number;
  active_schedule: number;
  paused_schedule: number;
  completed_schedule: number;
};
const initialState: StatsAIState = {
  total_prompt: 0,
  active_prompt: 0,
  paused_prompt: 0,
  total_schedule: 0,
  active_schedule: 0,
  paused_schedule: 0,
  completed_schedule: 0,
};
const statsAISlice = createSlice({
  name: "statsAI",
  initialState,
  reducers: {
    setStatsAI: (state, action: PayloadAction<Partial<StatsAIState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    resetStatsAI: () => initialState,
  },
});
export const { setStatsAI, resetStatsAI } = statsAISlice.actions;
export default statsAISlice.reducer;
