import { NextFunction, Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import jwt from "jsonwebtoken";
import { CustomSocket } from "src/types";
export const verifyAccessTokenSocket = (
  socket: CustomSocket,
  next: NextFunction
) => {
  const accessToken: string = socket.handshake.auth.token;
  if (!accessToken) {
    return next(new Error("Bạn không có quyền truy cập"));
  }
  const secretKey = process.env.ACCESSTOKEN_KEY;
  if (!secretKey) {
    return next(new Error("ACCESSTOKEN_KEY chưa được cấu hình"));
  }
  jwt.verify(accessToken, secretKey, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new Error("Token đã hết hạn"));
      }

      return next(new Error("Token không hợp lệ"));
    }
    socket.decoded = decoded;
    next();
  });
};

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "Bạn không có quyền truy cập",
      });
    }
    const accessToken = authorization.split(" ")[1];
    const secretKey = process.env.ACCESSTOKEN_KEY;
    if (!secretKey) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "ACCESSTOKEN_KEY chưa được cấu hình",
      });
    }
    jwt.verify(accessToken, secretKey, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: "Token đã hết hạn",
          });
        }

        return res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          message: "Token không hợp lệ",
        });
      }
      req.user = decoded;
      next();
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const refreshToken: string = req.cookies.refreshToken;
    if (!(refreshToken || req.isAuthenticated())) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "Bạn không có quyền truy cập",
      });
    }
    const secretKey = process.env.REFRESHTOKEN_KEY;
    if (!secretKey) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "REFRESHTOKEN_KEY chưa được cấu hình",
      });
    }
    jwt.verify(refreshToken, secretKey, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: "Token đã hết hạn",
          });
        }

        return res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          message: "Token không hợp lệ",
        });
      }
      req.user = decoded;
      next();
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const verifyResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token: string = req.body.token;
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "Token không hợp lệ",
      });
    }
    const secretKey = process.env.RESET_TOKEN_KEY;
    if (!secretKey) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Secret key chưa được cấu hình",
      });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: "Token đã hết hạn",
          });
        }

        return res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          message: "Token không hợp lệ",
        });
      }
      req.user = decoded;
      next();
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    await verifyAccessToken(req, res, () => {
      if (req.user) {
        const user: any = req.user;
        if (user.role !== "admin") {
          return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: "Bạn không có quyền truy cập",
          });
        }
        next();
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: StatusCodes.UNAUTHORIZED,
          message: "Người dùng không được xác thực",
        });
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
