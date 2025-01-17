import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { sendOtpService } from "src/services";
import { Request, Response } from "express";
export const sendOtpController = async (
  req: Request<{}, {}, { email: string }, { forgotPassword: boolean }>,
  res: Response
) => {
  try {
    const { email } = req.body;
    const { forgotPassword } = req.query;
    const { status, message } = await sendOtpService(email, forgotPassword);
    return res.status(status).json({
      status,
      message,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
