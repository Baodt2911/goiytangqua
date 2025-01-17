import jwt from "jsonwebtoken";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { _refreshToken } from "../models";
import axios from "axios";
export const generateAccessToken = (payload: any) => {
  const secretKey = process.env.ACCESSTOKEN_KEY || "12345";
  return jwt.sign(
    {
      userId: payload._id || payload.userId,
      role: payload.role,
    },
    secretKey,
    { expiresIn: 1000 * 60 * 60 * 24 }
  );
};
export const generateRefreshToken = (payload: any) => {
  const secretKey = process.env.REFRESHTOKEN_KEY || "12345";
  return jwt.sign(
    {
      userId: payload._id || payload.userId,
      role: payload.role,
    },
    secretKey,
    {
      expiresIn: "15d",
    }
  );
};
export const saveRefreshTokenService = async (token: string, payload: any) => {
  try {
    const currentDate = new Date();
    const expiresIn =
      Math.floor(currentDate.getTime() / 1000) + 15 * 24 * 60 * 60;
    return await _refreshToken.findOneAndUpdate(
      {
        userId: payload._id || payload.userId,
      },
      {
        token,
        expiresAt: new Date(expiresIn * 1000), // Convert seconds to milliseconds
      },
      {
        upsert: true,
        new: true,
      }
    );
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const refreshTokenService = async (token: string, user: any) => {
  try {
    const refreshToken = await _refreshToken.findOne({ token });
    if (!refreshToken) {
      return {
        status: StatusCodes.FORBIDDEN,
        message: "Refresh token không hợp lệ",
      };
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    await saveRefreshTokenService(newRefreshToken, user);
    return {
      status: StatusCodes.OK,
      message: "Refresh token thành công",
      element: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const deleteRefreshTokenService = async (token: string) => {
  try {
    return await _refreshToken.deleteOne({ token });
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const refreshGoogleAccessTokenService = async (token: string) => {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: token,
      grant_type: "refresh_token",
    });

    const newAccessToken = response.data.access_token;
    return {
      status: StatusCodes.OK,
      message: "Refresh token thành công",
      element: {
        accessToken: newAccessToken,
      },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
