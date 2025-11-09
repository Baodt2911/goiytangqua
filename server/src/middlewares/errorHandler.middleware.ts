import { NextFunction, Request, Response } from "express";

import logger from "../utils/logger";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
  logger.error({
    message: message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(status).json({
    status,
    message,
  });
}
