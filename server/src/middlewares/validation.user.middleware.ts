import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import {
  LoginRequestDTO,
  RegisterRequestDTO,
  UpdateProfileRequestDTO,
  ChangePaswordRequestDTO,
} from "src/dtos";
import { isValidDate, isValidString } from "src/utils";

export const validateLoginRequest = (
  req: Request<{}, {}, LoginRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { email, password } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Email không hợp lệ",
    });
  }

  if (!isValidString(password)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Mật khẩu không hợp lệ",
    });
  }

  next();
};
export const validateRegisterRequest = (
  req: Request<{}, {}, RegisterRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { email, password, otp } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Email không hợp lệ",
    });
  }

  if (!isValidString(password)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Mật khẩu không hợp lệ",
    });
  }

  if (!isValidString(otp)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Mã xác nhận không hợp lệ",
    });
  }
  next();
};
export const validateUpdateProfileRequest = (
  req: Request<{}, {}, UpdateProfileRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { name, birthday, gender } = req.body;
  if (!isValidString(name)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: StatusCodes.BAD_REQUEST, message: "Tên không hợp lệ" });
  }

  if (!isValidDate(birthday)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Ngày sinh phải là 'yyyy/mm/dd'",
    });
  }

  if (gender !== "nam" && gender !== "nữ") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Giới tính phải là nam hoặc nữ",
    });
  }

  next();
};
export const validateChangePaswordRequest = (
  req: Request<{}, {}, ChangePaswordRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const { currentPassword, newPassword } = req.body;

  if (!isValidString(currentPassword)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Mật khẩu hiện tại không hợp lệ",
    });
  }

  if (!isValidString(newPassword)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Mật khẩu mới không hợp lệ",
    });
  }

  next();
};
export const validateRequestResetPasswordRequest = (
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction
): any => {
  const { email } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Email không hợp lệ",
    });
  }

  next();
};
export const validateResetPaswordRequest = (
  req: Request<{}, {}, { newPassword: string }>,
  res: Response,
  next: NextFunction
): any => {
  const { newPassword } = req.body;

  if (!isValidString(newPassword)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Mật khẩu mới không hợp lệ",
    });
  }

  next();
};
