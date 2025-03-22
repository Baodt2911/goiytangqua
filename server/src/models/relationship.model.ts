import { Schema, model } from "mongoose";
import { Relationship } from "src/types";
const relationshipSchema = new Schema<Relationship>({
  userId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  relationshipType: { type: String, required: true },
  preferences: [{ type: String }],
  anniversaries: [
    {
      name: { type: String, required: true },
      date: {
        day: { type: Number, required: true },
        month: { type: Number, required: true },
      },
    },
  ],
});
export default model<Relationship>("relationships", relationshipSchema);
