import { Document } from "mongoose";
import { Conversation, Message } from "src/types";

export type ConversationRequestDTO = Omit<
  Conversation,
  "userId" | keyof Document
>;
export type MessageRequestDTO = Omit<Message, "createdAt">;
