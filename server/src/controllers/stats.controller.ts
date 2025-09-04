import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getStatsOverviewAIService } from "src/services";

export const getStatsOverviewAIController = async (
  req: Request,
  res: Response
) => {
  try {
    const { status, element } = await getStatsOverviewAIService();
    res.status(status).json({ status, stats: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
