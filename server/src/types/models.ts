import { Document, ObjectId } from "mongoose";
export type BaseModel = Document & {
  createdAt: Date;
  updatedAt: Date;
};
export type User = Document & {
  name?: string;
  email: string;
  password?: string;
  googleId?: string;
  birthday?: Date;
  gender?: "nam" | "nữ";
  preferences?: string[];
  role: "admin" | "user";
  googleRefreshToken?: string;
} & BaseModel;
export type Post = Document & {
  title: string;
  thumbnail?: string;
  description?: string;
  slug: string;
  content: string;
  tags?: string[];
  filters?: Record<string, string>;
  products?: ObjectId[];
  status: "draft" | "published" | "scheduled";
  publishedAt?: Date;
  scheduledFor?: Date;
  views: number;
  isFeatured: boolean;
  author: string;
  generatedBy: "human" | "ai" | "hybrid";
  aiPromptId?: ObjectId;
} & BaseModel;

export type AIPrompt = Document & {
  name: string; // "Daily Tech News", "Product Review"
  promptTemplate: string; // The actual prompt for AI
  description?: string;

  // AI settings
  aiProvider: "openai" | "claude" | "gemini";
  aiModel: string; // "gpt-4", "claude-3-sonnet"
  temperature: number; // Creativity 0-1
  maxTokens: number; // Response length

  systemMessage?: string;

  // Content defaults
  categories: "chatbot" | "gift" | "notification" | "article";
  defaultTags: string[]; // Auto-applied tags
  targetWordCount: number; // Desired length

  availableVariables?: string[]; // ["gender", "age", "relation"]
  // Status
  isActive: boolean;
} & BaseModel;

// 3. Content Schedule - Automation timing
export type ContentSchedule = Document & {
  name: string; // "Daily Morning Post"
  aiPromptId: ObjectId; // Which prompt to use

  // Timing
  frequency: "once" | "daily" | "weekly" | "monthly";
  scheduleTime: string; // "08:00" or "Mon-08:00"
  nextRunAt: Date; // Next execution

  // Auto-publish settings
  autoPublish: boolean; // Publish immediately or draft

  // Status & tracking
  status: "active" | "paused" | "completed";
  lastRunAt?: Date;
  totalRuns: number;
} & BaseModel;

export type Comment = Document & {
  content: string;
  postId: ObjectId;
  userId: ObjectId;
} & BaseModel;

export type Product = Document & {
  name: string;
  slug: string;
  price: number;
  image: string;
  link: string;
  description: string;
  tags?: string[];
  category: string;
} & BaseModel;

export type RefreshToken = Document & {
  token: string;
  userId: ObjectId;
  expires: Date;
};

export type Relationship = Document & {
  userId: ObjectId;
  name: string;
  relationshipType: string;
  preferences?: string[];
  anniversaries: {
    _id: ObjectId;
    name: string;
    date: {
      day: number;
      month: number;
    };
    lastNotified: Date;
  }[];
};

export type Notification = Document & {
  userId: ObjectId;
  relationshipId: ObjectId;
  message: string;
  title: string;
  read: boolean;
} & BaseModel;

export type Filter = Document & {
  type: string;
  options: string[];
};
export type Otp = Document & {
  email: string;
  otp: string;
  expires: Date;
} & BaseModel;

export type Message = {
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
};

export type Conversation = Document & {
  userId: string;
  title?: string;
  messages: Message[];
} & BaseModel;
