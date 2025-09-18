import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageType } from "../../types/message.type";
type MessageState = {
  messages: MessageType[];
  loading: boolean;
  error: string | null;
  currentConversationId?: string;
  streaming: {
    conversationId?: string;
    content: string;
  } | null;
};
const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
  currentConversationId: undefined,
  streaming: null,
};
const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // GET
    getMessagesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getMessagesSuccess: (state, action: PayloadAction<MessageType[]>) => {
      state.messages = action.payload;
      state.loading = false;
    },
    getMessagesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CREATE
    createMessage: (state, action: PayloadAction<MessageType>) => {
      state.messages.push(action.payload);
    },

    // STREAMING (assistant incremental reply)
    startAssistantStream: (
      state,
      action: PayloadAction<{ conversationId?: string }>
    ) => {
      // Set current conversation ID when we start streaming (first message creates conversation)
      if (action.payload.conversationId && !state.currentConversationId) {
        state.currentConversationId = action.payload.conversationId;
      }
      if (!state.streaming) {
        state.streaming = {
          conversationId: action.payload.conversationId,
          content: "",
        };
      }
    },
    appendAssistantStream: (state, action: PayloadAction<string>) => {
      if (state.streaming) {
        state.streaming.content += action.payload;
      }
    },
    finishAssistantStream: (state) => {
      if (state.streaming && state.streaming.content) {
        state.messages.push({
          _id: `temp-${Date.now()}`,
          role: "assistant",
          content: state.streaming.content,
        });
      }
      state.streaming = null;
    },
    setMessageError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    addUserMessageOptimistic: (
      state,
      action: PayloadAction<{ content: string }>
    ) => {
      state.messages.push({
        _id: `temp-user-${Date.now()}`,
        role: "user",
        content: action.payload.content,
      });
    },
    setCurrentConversationId: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    },
    clearCurrentConversationId: (state) => {
      state.currentConversationId = undefined;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.streaming = null;
      state.error = null;
    },
  },
});
export const {
  getMessagesStart,
  getMessagesSuccess,
  getMessagesFailure,
  createMessage,
  startAssistantStream,
  appendAssistantStream,
  finishAssistantStream,
  setMessageError,
  addUserMessageOptimistic,
  setCurrentConversationId,
  clearCurrentConversationId,
  clearMessages,
} = messageSlice.actions;
export default messageSlice.reducer;
