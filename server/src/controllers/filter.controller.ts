import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { FilterRequestDTO } from "src/dtos";
import {
  addFilterService,
  deleteFilterService,
  getFilterService,
  updateFilterService,
} from "src/services";
export const getFilterController = async (req: Request, res: Response) => {
  try {
    const { status, element } = await getFilterService();
    res.status(status).json({ status, filters: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const addFilterController = async (
  req: Request<{}, {}, FilterRequestDTO>,
  res: Response
) => {
  try {
    const { type, options } = req.body;
    const { status, message } = await addFilterService({ type, options });
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const deleteFilterController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status, message } = await deleteFilterService(id);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const updateFilterController = async (
  req: Request<{ id: string }, {}, FilterRequestDTO>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { type, options } = req.body;
    const { status, message } = await updateFilterService(id, {
      type,
      options,
    });
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
