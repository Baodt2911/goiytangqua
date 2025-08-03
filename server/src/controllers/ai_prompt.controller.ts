import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { AIPromptRequestDTO } from "src/dtos";
import {
  createPromptService,
  deletePromptService,
  getAllPromptService,
  getPromptService,
  updatePromptService,
} from "src/services";
export const createPromptController = async (
  req: Request<{}, {}, AIPromptRequestDTO>,
  res: Response
) => {
  try {
    const data = req.body;
    const { status, message } = await createPromptService(data);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const updatePromptController = async (
  req: Request<{ id: string }, {}, Partial<AIPromptRequestDTO>>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { status, message } = await updatePromptService(id, data);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getPromptController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status, element } = await getPromptService(id);
    res.status(status).json({ status, prompt: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getAllPromptController = async (req: Request, res: Response) => {
  try {
    const { status, element } = await getAllPromptService();
    res.status(status).json({ status, prompts: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const deletePromptController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status, message } = await deletePromptService(id);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
