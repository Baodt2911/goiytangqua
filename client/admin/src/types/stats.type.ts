export type StatsAIType = {
  total_prompt: number;
  active_prompt: number;
  paused_prompt: number;
  total_schedule: number;
  active_schedule: number;
  paused_schedule: number;
  completed_schedule: number;
};

export type StatsOverviewType = {
  total_post_featured: number;
  total_user: number;
  total_post: number;
  total_comments: number;
  total_products: number;
  total_conversations: number;
};

export type StatsPostType = {
  status: string;
  count: number;
};

export type StatsActivitiesType = {
  type: string;
  data: any;
  time: string | Date;
};

export type StatsTopContentType = {
  _id: string;
  title: string;
  views: number;
  commentCount: number;
  totalInteractions: number;
};
