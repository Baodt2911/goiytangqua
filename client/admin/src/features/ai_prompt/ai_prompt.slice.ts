import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AIPrompt } from "../../types/ai_prompt.type";

type AIPromptState = {
  prompts: AIPrompt[];
  loading: boolean;
  error: string | null;
};

const initialState: AIPromptState = {
  prompts: [],
  loading: false,
  error: null,
};

const aiPromptSlice = createSlice({
  name: "ai_prompt",
  initialState,
  reducers: {
    // GET
    getPromptStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPromptSuccess: (state, action: PayloadAction<AIPrompt[]>) => {
      state.prompts = action.payload;
      state.loading = false;
    },
    getPromptFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CREATE
    createPrompt: (state, action: PayloadAction<AIPrompt>) => {
      state.prompts.push(action.payload);
    },

    // UPDATE
    updatePrompt: (state, action: PayloadAction<AIPrompt>) => {
      const index = state.prompts.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.prompts[index] = action.payload;
      }
    },

    // DELETE
    deletePrompt: (state, action: PayloadAction<string>) => {
      state.prompts = state.prompts.filter((p) => p._id !== action.payload);
    },
  },
});
export const {
  getPromptStart,
  getPromptSuccess,
  getPromptFailure,
  createPrompt,
  updatePrompt,
  deletePrompt,
} = aiPromptSlice.actions;
export default aiPromptSlice.reducer;
