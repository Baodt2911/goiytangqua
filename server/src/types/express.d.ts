import { JwtPayload } from "jsonwebtoken";
interface JwtPayload {
  userId: string;
  role: string;
}

// Mở rộng kiểu Request để thêm thuộc tính 'user'
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
