import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ProductRequestDTO } from "src/dtos";
import { isValidString } from "src/utils";
export const validateProductRequest = (
  req: Request<{}, {}, ProductRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { name, price, slug, link, description, tags, image, category } =
    req.body;
  const requiredStrings = { name, slug, description, link, image, category };
  for (const [key, value] of Object.entries(requiredStrings)) {
    if (!isValidString(value)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: `${key} không hợp lệ`,
      });
    }
  }
  if (!isNaN(price) && typeof price !== "number") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "price phải là số",
    });
  }
  if (tags && !Array.isArray(tags)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "tags phải là một mảng (vd: tags:['sinh nhật','valentine',...])",
    });
  }
  next();
};
export const validateUpdateProductRequest = (
  req: Request<{}, {}, ProductRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { name, price, slug, link, description, tags, image, category } =
    req.body;
  const requiredStrings = { name, slug, description, link, image, category };
  for (const [key, value] of Object.entries(requiredStrings)) {
    if (value && !isValidString(value)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: `${key} không hợp lệ`,
      });
    }
  }
  if (!isNaN(price) && typeof price !== "number") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "price phải là số",
    });
  }
  if (tags && !Array.isArray(tags)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "tags phải là một mảng (vd: tags:['sinh nhật','valentine',...])",
    });
  }
  next();
};
