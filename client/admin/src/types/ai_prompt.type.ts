export type AIPrompt = {
  _id?: string;
  name: string;
  promptTemplate: string;
  description?: string;
  aiProvider: "openai" | "claude" | "gemini" | undefined;
  aiModel: string;
  temperature: number;
  maxTokens: number;
  systemMessage?: string;
  categories?: ("chatbot" | "gift" | "notification" | "article")[] | undefined;
  defaultTags: string[];
  targetWordCount: number;
  availableVariables?: string[];
  isActive: boolean;
  updatedAt?: Date | undefined;
};
