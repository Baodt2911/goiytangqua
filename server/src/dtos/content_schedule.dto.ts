import { Document } from "mongoose";
import { ContentSchedule } from "src/types";

export type ContentScheduleRequestDTO = Omit<ContentSchedule, keyof Document>;
