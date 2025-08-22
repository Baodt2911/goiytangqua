import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AIPrompt } from "../../types/ai_prompt.type";

type AIPromptState = AIPrompt;

const initialState: AIPromptState = {
  name: "",
  promptTemplate: "",
  description: "",
  aiProvider: undefined,
  aiModel: "",
  temperature: 0,
  maxTokens: 0,
  systemMessage: "",
  categories: undefined,
  defaultTags: [],
  targetWordCount: 0,
  availableVariables: [],
  isActive: false,
  updatedAt: undefined,
};

const selectedAIPromptSlice = createSlice({
  name: "selectedAIPrompt",
  initialState,
  reducers: {
    setPrompt: (state, action: PayloadAction<Partial<AIPrompt>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    resetPrompt: () => initialState,
  },
});
export const { setPrompt, resetPrompt } = selectedAIPromptSlice.actions;
export default selectedAIPromptSlice.reducer;
