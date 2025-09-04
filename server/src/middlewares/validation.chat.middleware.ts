import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { ChatRequestDTO, MessageRequestDTO } from "src/dtos";
const { ObjectId } = mongoose.Types;
import { isValidString } from "src/utils";
export const validateChatRequest = (
  req: Request<{}, {}, ChatRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { conversationId, msg } = req.body;
  if (conversationId && !ObjectId.isValid(conversationId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "conversationId không hợp lệ",
    });
  }
  if (!isValidString(msg)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "msg phải là một chuỗi",
    });
  }
  next();
};
export const validateAddMessageConversationRequest = (
  req: Request<{}, {}, MessageRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { role, content } = req.body;

  if (role !== "user" && role !== "assistant") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "role phải là user hoặc assistant",
    });
  }
  if (!isValidString(content)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "content phải là một chuỗi",
    });
  }
  next();
};
