import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  getStatsAIService,
  getStatsTopContentService,
  getStatsActivitiesService,
  getStatsPostService,
  getStatsOverviewService,
} from "src/services";

export const getStatsAIController = async (req: Request, res: Response) => {
  try {
    const { status, element } = await getStatsAIService();
    res.status(status).json({ status, stats: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getStatsOverviewController = async (
  req: Request,
  res: Response
) => {
  try {
    const { status, element } = await getStatsOverviewService();
    res.status(status).json({ status, stats: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getStatsTopContentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { status, element } = await getStatsTopContentService();
    res.status(status).json({ status, stats: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getStatsActivitiesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { status, element } = await getStatsActivitiesService();
    res.status(status).json({ status, stats: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getStatsPostController = async (req: Request, res: Response) => {
  try {
    const { status, element } = await getStatsPostService();
    res.status(status).json({ status, stats: element });
  } catch (error) {}
};
