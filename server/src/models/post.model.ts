import { Schema, model } from "mongoose";
import { Post } from "src/types";
const postSchema = new Schema<Post>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    filters: { type: Map, of: String },
    products: [{ type: Schema.Types.ObjectId, ref: "products" }],
  },
  {
    timestamps: true,
  }
);
export default model<Post>("posts", postSchema);
