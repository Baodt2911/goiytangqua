import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ConversationRequestDTO, MessageRequestDTO } from "src/dtos";
import { _conversation } from "src/models";

export const getAllConversationsService = async (user: any) => {
  try {
    const existingConversations = await _conversation
      .find({
        userId: user.userId,
      })
      .select("-messages")
      .lean();
    return {
      status: StatusCodes.OK,
      element: existingConversations,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const getMessagesConversationService = async (
  user: any,
  _id: string
) => {
  try {
    const existingConversations = await _conversation
      .findOne({
        userId: user.userId,
        _id,
      })
      .lean();
    if (!existingConversations) {
      return {
        status: StatusCodes.OK,
        message: "Đoạn chat không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      element: {
        messages: existingConversations.messages,
      },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const addMessageConversationService = async (
  user: any,
  _id: string,
  data: MessageRequestDTO
) => {
  try {
    const existingConversations = await _conversation.findOne({
      userId: user.userId,
      _id,
    });
    if (!existingConversations) {
      return {
        status: StatusCodes.OK,
        message: "Đoạn chat không tồn tại hoặc đã bị xóa",
      };
    }
    existingConversations.messages.push(data);
    await existingConversations.save();
    return {
      status: StatusCodes.CREATED,
      message: "Thêm message thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const createConversationService = async (
  user: any,
  data: ConversationRequestDTO
) => {
  try {
    const newConversation = await _conversation.create({
      userId: user.userId,
      ...data,
    });
    return {
      status: StatusCodes.CREATED,
      element: {
        conversation: newConversation,
      },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
