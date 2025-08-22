import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { PostRequestDTO } from "src/dtos";
import { isValidString } from "src/utils";
const { ObjectId } = mongoose.Types;
export const validatePostRequest = (
  req: Request<{}, {}, PostRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { title, content, slug, filters, products, tags } = req.body;

  const requiredStrings = { title, content, slug };
  for (const [key, value] of Object.entries(requiredStrings)) {
    if (!isValidString(value)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: `${key} không hợp lệ`,
      });
    }
  }
  if (tags && !Array.isArray(tags)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "tags phải là một mảng (vd: tags:['sinh nhật','valentine',...])",
    });
  }
  if (products?.length === 0) {
    const isValid = products.every((id) => ObjectId.isValid(id.toString()));
    if (!isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "id product không hợp lệ",
      });
    }
  }
  if (filters && typeof filters !== "object") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message:
        "filters phải là một object (vd: filters={price:100,category:'tivi'})",
    });
  }
  next();
};
export const validateUpdatePostRequest = (
  req: Request<{}, {}, PostRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { title, content, slug, filters, products, tags } = req.body;

  const requiredStrings = { title, content, slug };
  for (const [key, value] of Object.entries(requiredStrings)) {
    if (value && !isValidString(value)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: `${key} không hợp lệ`,
      });
    }
  }
  if (tags && !Array.isArray(tags)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "tags phải là một mảng (vd: tags:['sinh nhật','valentine',...])",
    });
  }
  if (products) {
    const isValid = products.every((id) => ObjectId.isValid(id.toString()));
    if (!isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "id không hợp lệ",
      });
    }
  }
  if (filters && typeof filters !== "object") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message:
        "filters phải là một object (vd: filters={price:100,category:'tivi'})",
    });
  }
  next();
};
