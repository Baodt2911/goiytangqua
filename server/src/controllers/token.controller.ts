import { Request, Response } from "express";
import {
  refreshGoogleAccessTokenService,
  refreshTokenService,
} from "src/services";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { setCookie } from "src/controllers";

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { refreshToken } = req.cookies;
    if (req.isAuthenticated()) {
      req.login(req.user, (err) => {
        if (err) {
          throw new Error(err);
        }
        console.log("refresh sessions");
      });
    }
    const { status, message, element } = await refreshTokenService(
      refreshToken,
      user
    );
    if (status === StatusCodes.OK) {
      const currentTime = new Date();
      setCookie(res, "refreshToken", element?.refreshToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(currentTime.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days
      });
    }
    res.status(status).json({
      status,
      message,
      accessToken: element?.accessToken,
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const refreshGoogleAccessTokenController = async (
  req: Request,
  res: Response
) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split(" ")[1] || "";
    const { status, message, element } = await refreshGoogleAccessTokenService(
      token
    );
    res.status(status).json({
      status,
      message,
      accessToken: element?.accessToken,
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
