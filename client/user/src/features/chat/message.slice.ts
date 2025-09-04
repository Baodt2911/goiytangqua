import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageType } from "../../types/message.type";
type MessageState = {
  messages: MessageType[];
  loading: boolean;
  error: string | null;
};
const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
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
  },
});
export const {
  getMessagesStart,
  getMessagesSuccess,
  getMessagesFailure,
  createMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
