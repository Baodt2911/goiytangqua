import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  getNotificationService,
  updateReadNotificationService,
} from "src/services";

export const getNotificationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.user as any;
    const { status, element } = await getNotificationService(userId);
    res.status(status).json({ status, notifications: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const updateReadNotificationController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { userId } = req.user as any;
    const { id } = req.params;
    const { status, message } = await updateReadNotificationService(userId, id);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
