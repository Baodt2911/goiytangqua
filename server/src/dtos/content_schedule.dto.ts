import { Document } from "mongoose";
import { ContentSchedule } from "src/types";

export type ContentScheduleRequestDTO = Omit<ContentSchedule, keyof Document |'nextRunAt' | 'lastRunAt' | 'totalRuns' | 'status'>;
export type ContentScheduleUpdateRequestDTO = Omit<ContentSchedule, keyof Document  | 'lastRunAt' | 'totalRuns'| 'aiPromptId'>