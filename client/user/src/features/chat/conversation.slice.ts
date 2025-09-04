import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConversationType } from "../../types/coversation.type";
type ConversationState = {
  conversations: ConversationType[];
  loading: boolean;
  error: string | null;
};
const initialState: ConversationState = {
  conversations: [],
  loading: false,
  error: null,
};
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    // GET
    getConversationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getConversationsSuccess: (
      state,
      action: PayloadAction<ConversationType[]>
    ) => {
      state.conversations = action.payload;
      state.loading = false;
    },
    getConversationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CREATE
    createConversation: (state, action: PayloadAction<ConversationType>) => {
      state.conversations.push(action.payload);
    },

    // DELETE
    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        (p) => p._id !== action.payload
      );
    },
  },
});
export const {
  getConversationsStart,
  getConversationsSuccess,
  getConversationsFailure,
  createConversation,
  deleteConversation,
} = conversationSlice.actions;
export default conversationSlice.reducer;
