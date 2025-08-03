import { model, Schema } from "mongoose";
import { AIPrompt } from "src/types";

const AIPromptSchema = new Schema<AIPrompt>(
  {
    name: { type: String, required: true },
    promptTemplate: { type: String, required: true },
    description: { type: String },
    aiProvider: {
      type: String,
      enum: ["openai", "claude", "gemini"],
      required: true,
    },
    aiModel: { type: String, required: true },
    temperature: { type: Number, required: true, default: 0.7 },
    maxTokens: { type: Number, required: true },
    systemMessage: { type: String },
    categories: {
      type: [String],
      enum: ["chatbot", "gift", "notification", "article"],
      required: false,
    },

    defaultTags: [{ type: String, required: true }],
    targetWordCount: { type: Number, required: true },
    availableVariables: [{ type: String }],
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
export default model<AIPrompt>("ai_prompts", AIPromptSchema);
