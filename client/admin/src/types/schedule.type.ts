export type ContentSchedule = {
  _id?: string;
  name: string;
  aiPromptId: string;
  frequency: "once" | "daily" | "weekly" | "monthly" | undefined;
  scheduleTime: string;
  nextRunAt: Date | undefined;
  autoPublish: boolean;
  status: "active" | "paused" | "completed" | undefined;
  lastRunAt?: Date | undefined;
  totalRuns: number;
};
