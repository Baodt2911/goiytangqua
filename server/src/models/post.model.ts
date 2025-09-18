import { Schema, model } from "mongoose";
import { Post } from "src/types";
const postSchema = new Schema<Post>(
  {
    title: { type: String, required: true },
    thumbnail: { type: String, default: "https://res.cloudinary.com/goiytangqua/image/upload/v1757424505/images_product/default/thumnail-goiytangqua.png" },
    description: { type: String },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    filters: { type: Map, of: String },
    products: [{ type: Schema.Types.ObjectId, ref: "products" }],
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    publishedAt: { type: Date },
    scheduledFor: { type: Date },
    views: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    author: { type: String, required: true, default: "Baodt2911" },
    generatedBy: {
      type: String,
      enum: ["human", "ai", "hybrid"],
      default: "human",
    },
    aiPromptId: { type: Schema.Types.ObjectId, ref: "ai_prompts" },
  },
  {
    timestamps: true,
  }
);
export default model<Post>("posts", postSchema);
