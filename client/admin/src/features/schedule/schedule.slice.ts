import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentSchedule } from "../../types/schedule.type";

type ScheduleState = ContentSchedule;

const initialState: ScheduleState = {
  _id: "",
  name: "",
  aiPromptId: "",
  frequency: undefined,
  scheduleTime: "",
  nextRunAt: undefined,
  autoPublish: false,
  status: undefined,
  lastRunAt: undefined,
  totalRuns: 0,
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setSchedule: (state, action: PayloadAction<Partial<ContentSchedule>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetSchedule: () => initialState,
  },
});
export const { setSchedule, resetSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
