import { Schema, model } from "mongoose";
import { RefreshToken } from "src/types";
const refreshTokenSchema = new Schema<RefreshToken>({
  userId: { type: Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
});
export default model<RefreshToken>("refreshToken", refreshTokenSchema);
