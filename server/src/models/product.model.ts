import { Schema, model } from "mongoose";
import { Product } from "src/types";
const productSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export default model<Product>("products", productSchema);
