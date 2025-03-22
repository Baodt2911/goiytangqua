import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { createCommentService, getCommentsService } from "src/services";

export const createCommentController = async (
  req: Request<{ id: string }, {}, { content: string }>,
  res: Response
) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { content } = req.body;
    const { status, message } = await createCommentService(user, {
      postId: id,
      content,
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
export const getCommentsController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status, element } = await getCommentsService(id);
    res.status(status).json({ status, comments: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
