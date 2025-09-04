import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
export const validateObjectIdRequest = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): any => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "id không hợp lệ",
    });
  }
  next();
};
