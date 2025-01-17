import { Schema, model } from "mongoose";
import { User } from "src/types";
const userSchema = new Schema<User>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    birthday: { type: Date },
    gender: { type: String, enum: ["male", "female"] },
    relationships: [{ type: Schema.Types.ObjectId, ref: "users" }],
    role: { type: String, enum: ["admin", "user"], default: "user" },
    googleRefreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);
export default model<User>("users", userSchema);
