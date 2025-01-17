import { Schema, model } from "mongoose";
import { Comment } from "src/types";
const commentSchema = new Schema<Comment>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    postId: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export default model<Comment>("comments", commentSchema);
