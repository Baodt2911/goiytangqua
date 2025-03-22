import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import { RelationshipRequestDTO } from "src/dtos";
import { isValidString } from "src/utils";

export const validateAddNewRelationshipRequest = (
  req: Request<{}, {}, RelationshipRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { name, relationshipType } = req.body;

  if (!isValidString(name)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Tên không hợp lệ",
    });
  }

  if (!isValidString(relationshipType)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Loại quan hệ không hợp lệ",
    });
  }
  next();
};

export const validateRemoveAnniversariesRequest = (
  req: Request<{ id_relationship: string; id_anniversaries: string }>,
  res: Response,
  next: NextFunction
): any => {
  const { id_relationship, id_anniversaries } = req.params;
  if (!ObjectId.isValid(id_relationship)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "id_relationship không hợp lệ",
    });
  }
  if (!ObjectId.isValid(id_anniversaries)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "id_anniversaries không hợp lệ",
    });
  }
  next();
};
export const validateUpdateRelationshipRequest = (
  req: Request<{ id: string }, {}, RelationshipRequestDTO>,
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
  const { name, relationshipType, anniversaries } = req.body;
  if (!isValidString(name)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Tên không hợp lệ",
    });
  }
  if (!isValidString(relationshipType)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Loại quan hệ không hợp lệ",
    });
  }
  if (anniversaries) {
    const isValid = anniversaries.every((item) => {
      if (!item.name || typeof item.name !== "string") {
        return false;
      }
      if (item.date.day > 31) {
        return false;
      }
      if (item.date.month > 12) {
        return false;
      }
      return true;
    });

    if (!isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message:
          "Vui lòng kiểm tra lại (name phải là 1 chuỗi, day <= 31, month <= 12)",
      });
    }
  }
  next();
};
