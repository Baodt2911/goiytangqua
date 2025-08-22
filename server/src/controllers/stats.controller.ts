import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getPromptStatsService } from "src/services";

export const getPromptStatsController = async (req: Request, res: Response) => {
  try {
    const { status, element } = await getPromptStatsService();
    res.status(status).json({ status, stats: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
