import { Document } from "mongoose";
import { AIPrompt } from "src/types";

export type AIPromptRequestDTO = Omit<AIPrompt, keyof Document | "isActive">;
