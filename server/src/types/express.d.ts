import { JwtPayload as JsonWebTokenPayload } from "jsonwebtoken";
import * as express from "express";
interface CustomJwtPayload extends JsonWebTokenPayload {
  userId: string;
  role: string;
  otp: string;
}

// Mở rộng kiểu Request để thêm thuộc tính 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
        otp: string;
      };
    }
  }
}
