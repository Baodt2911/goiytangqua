import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ContentScheduleRequestDTO, ContentScheduleUpdateRequestDTO } from "src/dtos";
import { isValidDate, isValidString } from "src/utils";
const { ObjectId } = mongoose.Types;
export const validateContentScheduleRequest = (
  req: Request<{}, {}, ContentScheduleRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const {
    name,
    aiPromptId,
    frequency,
    scheduleTime,
    autoPublish,
  } = req.body;

  if (!isValidString(name)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `name không hợp lệ`,
    });
  }

    // if (!ObjectId.isValid(aiPromptId)) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({
    //     status: StatusCodes.BAD_REQUEST,
    //     message: "id không hợp lệ",
    //   });
    // }

  if (!["once", "daily", "weekly", "monthly"].includes(frequency)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `frequency không hợp lệ. frequency chỉ bao gồm once, daily, weekly, monthly`,
    });
  }

  if (!isValidString(scheduleTime)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `scheduleTime không hợp lệ`,
    });
  }

  if (!(typeof autoPublish === "boolean")) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `autoPublish không hợp lệ`,
    });
  }
  next();
};
export const validateUpdateContentScheduleRequest = (
  req: Request<{}, {}, ContentScheduleUpdateRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { name, frequency, scheduleTime, autoPublish, status } =
    req.body;
  if (name && !isValidString(name)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `name không hợp lệ`,
    });
  }

  if (
    frequency &&
    !["once", "daily", "weekly", "monthly"].includes(frequency)
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `frequency không hợp lệ. frequency chỉ bao gồm once, daily, weekly, monthly`,
    });
  }

  if (scheduleTime && !isValidString(scheduleTime)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `scheduleTime không hợp lệ`,
    });
  }

  if (!(typeof autoPublish === "boolean")) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `autoPublish không hợp lệ`,
    });
  }

  if (status && !["active", "paused", "completed"].includes(status)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `status không hợp lệ. status chỉ bao gồm active, paused, completed`,
    });
  }

  next();
};
