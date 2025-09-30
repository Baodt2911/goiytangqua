import { resetPasswordService } from "./../services/user.service";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  ChangePaswordRequestDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  UpdateProfileRequestDTO,
} from "src/dtos";
import {
  loginService,
  logoutService,
  registerService,
  googleCallbackService,
  changePasswordService,
  getCurrentUserService,
  requestResetPasswordService,
  updateProfileService,
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
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
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
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        expires: new Date(currentTime.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days
      });
    }
    const script = `
      <script>
        window.opener.postMessage(
          { 
            success: true, 
            accessToken: "${element.accessToken}",
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
export const changePasswordController = async (
  req: Request<{}, {}, ChangePaswordRequestDTO>,
  res: Response
) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;
    const { message, status } = await changePasswordService(
      user,
      currentPassword,
      newPassword
    );
    res.status(status).json({ message });
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
export const requestResetPasswordController = async (
  req: Request<{}, {}, { email: string }>,
  res: Response
) => {
  try {
    const { email } = req.body;
    const { status, message } = await requestResetPasswordService(email);
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
export const resetPasswordController = async (
  req: Request<{}, {}, { newPassword: string }>,
  res: Response
) => {
  try {
    const user = req.user;
    const { newPassword } = req.body;
    const { status, message } = await resetPasswordService(user, newPassword);
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
export const updateProfileController = async (
  req: Request<{}, {}, UpdateProfileRequestDTO>,
  res: Response
) => {
  try {
    const user = req.user;
    const { name, birthday, gender, preferences } = req.body;
    console.log({ name, birthday, gender, preferences });

    const { status, message } = await updateProfileService(user, {
      name,
      birthday,
      gender,
      preferences,
    });
    res.status(status).json({ message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
