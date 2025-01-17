import bcrypt from "bcrypt";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { _user } from "src/models";
import { deleteOtpService, verifyOtpService } from "./otp.service";
import {
  saveRefreshTokenService,
  generateAccessToken,
  generateRefreshToken,
  deleteRefreshTokenService,
} from "./refresh_token.service";
import { User } from "src/types";

export const googleCallbackService = async (user: any) => {
  try {
    const existingUser = (await _user.findById(user.userId).lean()) as User;
    const { googleRefreshToken, ...other } = existingUser;
    const accessToken = generateAccessToken(other);
    const refreshToken = generateRefreshToken(other);
    await saveRefreshTokenService(refreshToken, other);
    return {
      status: StatusCodes.OK,
      message: "Đăng nhập thành công",
      element: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const getCurrentUserService = async (user: any) => {
  try {
    const existingUser = (await _user.findById(user.userId).lean()) as User;
    if (!user) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Không tìm thấy người dùng",
      };
    }
    const { name, email, gender, birthday, relationships, role } = existingUser;
    return {
      status: StatusCodes.OK,
      message: ReasonPhrases.OK,
      element: { name, email, gender, birthday, relationships, role },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const loginService = async (email: string, password: string) => {
  try {
    const isUser = (await _user.findOne({ email }).lean()) as User;
    if (!isUser) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Tài khoản không tồn tại",
      };
    }
    const { password: hashPassword, ...other } = isUser;
    const isMatch = await bcrypt.compare(password, hashPassword || "");
    if (!isMatch) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: "Mật khẩu không đúng",
      };
    }
    const accessToken = generateAccessToken(other);
    const refreshToken = generateRefreshToken(other);
    await saveRefreshTokenService(refreshToken, other);
    return {
      status: StatusCodes.OK,
      message: "Đăng nhập thành công",
      element: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const registerService = async (
  email: string,
  password: string,
  otp: string
) => {
  try {
    const { message, status, element } = await verifyOtpService(email, otp);
    if (!element) {
      return {
        status,
        message,
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await _user.create({ email, password: hashPassword });
    if (user) {
      await deleteOtpService(email);
    }
    return {
      status: StatusCodes.CREATED,
      message: "Đăng ký thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const logoutService = async (refreshToken: string) => {
  try {
    await deleteRefreshTokenService(refreshToken);
    return {
      status: StatusCodes.OK,
      message: "Đăng xuất thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
