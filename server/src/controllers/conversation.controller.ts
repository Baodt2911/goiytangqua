import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ConversationRequestDTO, MessageRequestDTO } from "src/dtos";
import {
  addMessageConversationService,
  createConversationService,
  getAllConversationsService,
  getMessagesConversationService,
} from "src/services";

export const getAllConversationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;
    const { status, element } = await getAllConversationsService(user);
    res.status(status).json({ status, conversations: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getMessagesConversationController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status, element } = await getMessagesConversationService(user, id);
    res.status(status).json({ status, ...element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export const addMessageConversationController = async (
  req: Request<{ id: string }, {}, MessageRequestDTO>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const data = req.body;
    const { status, message } = await addMessageConversationService(
      user,
      id,
      data
    );
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
