import { getCurrentUserService } from "./../services/user.service";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { LoginRequestDTO, RegisterRequestDTO } from "src/dtos";
import {
  loginService,
  logoutService,
  registerService,
  googleCallbackService,
} from "src/services";
import { Request, Response, CookieOptions } from "express";
export const setCookie = (
  res: Response,
  name: string,
  value: string | undefined,
  options: CookieOptions
) => {
  if (value) {
    res.cookie(name, value, options);
  }
};
export const getCurrentUserController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { status, message, element } = await getCurrentUserService(user);
    res.status(status).json({
      status,
      message,
      user: element,
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const loginController = async (
  req: Request<{}, {}, LoginRequestDTO>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const { status, message, element } = await loginService(email, password);
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
export const googleCallbackController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { status, message, element } = await googleCallbackService(user);
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
    const script = `
      <script>
        window.opener.postMessage(
          { 
            success: true, 
          }, 
          "${process.env.URL_CLIENT}"
        );
        window.close();
      </script>
    `;
    res.send(script);
    // res.redirect(process.env.URL_CLIENT + "/home");
    // res.status(status).json({
    //   status,
    //   message,
    // });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const registerController = async (
  req: Request<{}, {}, RegisterRequestDTO>,
  res: Response
) => {
  try {
    const { email, password, otp } = req.body;
    const { status, message } = await registerService(email, password, otp);
    res.status(status).json({
      status,
      message,
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (req.isAuthenticated()) {
      await new Promise<void>((resolve, reject) => {
        req.logout((err) => {
          if (err) return reject(err);
          req.session.destroy((sessionErr) => {
            if (sessionErr) {
              console.error("Failed to destroy session:", sessionErr);
              return reject(sessionErr);
            }
            res.clearCookie("connect.sid");
            resolve();
          });
        });
      });
    }
    const { status, message } = await logoutService(refreshToken);
    if (status === StatusCodes.OK) {
      res.clearCookie("refreshToken");
    }
    res.status(status).json({
      status,
      message,
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
