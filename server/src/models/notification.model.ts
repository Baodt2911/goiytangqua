import { Schema, model } from "mongoose";
import { Notification } from "src/types";
const notificationSchema = new Schema<Notification>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    relationshipId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
export default model<Notification>("notifications", notificationSchema);
