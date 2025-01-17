import { Schema, model } from "mongoose";
import { Otp } from "src/types";
const otpSchema = new Schema<Otp>(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expires: { type: Date, default: Date.now, index: { expires: 60 } },
  },
  {
    timestamps: true,
  }
);
export default model<Otp>("otps", otpSchema);
