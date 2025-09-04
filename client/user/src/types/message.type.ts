export type MessageType = {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};
