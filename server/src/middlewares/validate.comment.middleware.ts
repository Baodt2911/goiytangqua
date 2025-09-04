import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { isValidString } from "src/utils";
export const validateCommentRequest = (
  req: Request<{}, {}, { content: string }>,
  res: Response,
  next: NextFunction
): any => {
  const { content } = req.body;
  if (!isValidString(content)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "content phải là một chuỗi",
    });
  }

  next();
};
