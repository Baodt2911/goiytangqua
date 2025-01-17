import { Schema, model } from "mongoose";
import { Relationship } from "src/types";
const relationshipSchema = new Schema<Relationship>({
  userId: { type: Schema.Types.ObjectId, required: true },
  gender: { type: String, enum: ["male", "female"] },
  relationshipType: { type: String, required: true },
  preferences: [{ type: String }],
  anniversaries: [
    {
      name: { type: String, required: true },
      date: { type: Date, required: true },
    },
  ],
});
export default model<Relationship>("relationships", relationshipSchema);
