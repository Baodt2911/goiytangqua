import { Schema, model } from "mongoose";
import { Conversation, Message } from "src/types";

const messageSchema = new Schema<Message>({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const conversationSchema = new Schema<Conversation>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);
export default model<Conversation>("conversations", conversationSchema);
