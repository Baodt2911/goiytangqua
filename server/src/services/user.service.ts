import otpGenerate from "otp-generator";
import bcrypt from "bcrypt";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { _user } from "src/models";
import {
  saveRefreshTokenService,
  generateAccessToken,
  generateRefreshToken,
  deleteRefreshTokenService,
  deleteOtpService,
  verifyOtpService,
  generateResetToken,
  sendToEmail,
} from "src/services";
import { User } from "src/types";
import { UpdateProfileRequestDTO } from "src/dtos";

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
    const { name, email, gender, birthday, role, preferences } = existingUser;
    return {
      status: StatusCodes.OK,
      message: ReasonPhrases.OK,
      element: { name, email, gender, birthday, role, preferences },
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
export const changePasswordService = async (
  user: any,
  currentPassword: string,
  newPassword: string
) => {
  try {
    const existingUser = await _user.findById(user.userId);
    if (!existingUser) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Tài khoản không tồn tại",
      };
    }
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      existingUser?.password || ""
    );
    if (!isValidPassword) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: "Mật khẩu không đúng",
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    await existingUser?.updateOne({ $set: { password: hashPassword } });
    return {
      status: StatusCodes.OK,
      message: "Đổi mật khẩu thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const requestResetPasswordService = async (email: string) => {
  try {
    const isEmail = await _user.findOne({ email });
    if (!isEmail) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Email chưa đăng ký",
      };
    }
    const otp = otpGenerate.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const payload = {
      userId: isEmail._id,
      otp,
    };
    const token = generateResetToken(payload);
    const reset_url =
      process.env.URL_CLIENT + `/auth/reset-password?token=${token}`;
    const title = "goiytangqua - Đặt lại mật khẩu";
    const html = `<p>Thay đổi mật khẩu của bạn: ${reset_url}</p>`;
    await sendToEmail(email, title, html);
    return {
      status: StatusCodes.OK,
      message: "Vui lòng kiểm tra email của bạn",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const resetPasswordService = async (user: any, newPassword: string) => {
  try {
    const existingUser = await _user.findById(user.userId);
    if (!existingUser) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Tài khoản không tồn tại",
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    existingUser.updateOne({ $set: { password: hashPassword } });
    return {
      status: StatusCodes.OK,
      message: "Thay đổi mật khẩu thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const updateProfileService = async (
  user: any,
  data: UpdateProfileRequestDTO
) => {
  try {
    const { name, birthday, gender, preferences } = data;
    const updateFields: UpdateProfileRequestDTO = {};
    if (name) updateFields.name = name;
    if (birthday) updateFields.birthday = birthday;
    if (gender) updateFields.gender = gender;
    if (preferences) updateFields.preferences = preferences;

    if (Object.keys(updateFields).length === 0) {
      throw new Error("Không có trường nào hợp lệ để cập nhật");
    }
    const existingUser = await _user.findByIdAndUpdate(
      user.userId,
      {
        $set: updateFields,
      },
      { new: true }
    );
    if (!existingUser) {
      return {
        status: StatusCodes.OK,
        message: "Tài khoản không tồn tại",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Cập nhập thông tin thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
