import { model, Schema } from "mongoose";
import { ContentSchedule } from "src/types";

const contentScheduleSchema = new Schema<ContentSchedule>(
  {
    name: { type: String, required: true },
    aiPromptId: {
      type: Schema.Types.ObjectId,
      ref: "ai_prompts",
      required: true,
    },
    frequency: {
      type: String,
      enum: ["once", "daily", "weekly", "monthly"],
      required: true,
    },
    scheduleTime: { type: String, required: true, default: "00:00" },
    nextRunAt: { type: Date, required: true },
    autoPublish: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      required: true,
    },
    lastRunAt: { type: Date },
    totalRuns: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
export default model<ContentSchedule>(
  "contentSchedules",
  contentScheduleSchema
);
