import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ContentScheduleRequestDTO } from "src/dtos";
import {
  createScheduleService,
  deleteScheduleService,
  getScheduleService,
  updateScheduleService,
} from "src/services";
export const createScheduleController = async (
  req: Request<{}, {}, ContentScheduleRequestDTO>,
  res: Response
) => {
  try {
    const data = req.body;
    const { status, message } = await createScheduleService(data);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const updateScheduleController = async (
  req: Request<{ id: string }, {}, Partial<ContentScheduleRequestDTO>>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { status, message } = await updateScheduleService(id, data);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getScheduleController = async (
  req: Request<{ aiPromptId: string }>,
  res: Response
) => {
  try {
    const { aiPromptId } = req.params;
    const { status, element } = await getScheduleService(aiPromptId);
    res.status(status).json({ status, schedule: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export const deleteScheduleController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status, message } = await deleteScheduleService(id);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
