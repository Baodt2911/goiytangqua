import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { FilterRequestDTO } from "src/dtos";
import { isValidString } from "src/utils";
export const validateFilterRequest = (
  req: Request<{}, {}, FilterRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { type, options } = req.body;
  if (type && !isValidString(type)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "type phải là một chuỗi",
    });
  }
  if (!Array.isArray(options)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "options phải là một chuỗi mảng (vd: options: ['test'])",
    });
  }
  next();
};
