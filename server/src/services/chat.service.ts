import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { _conversation } from "src/models";
import { callAIWithPrompt } from "src/utils";
import {
  addMessageConversationService,
  createConversationService,
  getMessagesConversationService,
} from "./conversation.service";
import { Message } from "src/types";

export const chatService = async (user: any, msg: string, _id?: string) => {
  try {
    let conversationId = _id;
    let history: Message[] = [];

    if (_id) {
      const conv = await getMessagesConversationService(user, _id);
      history = conv?.element?.messages || [];
    } else {
      const {
        element: { conversation },
      } = await createConversationService(user, {
        title: msg,
        messages: [{ role: "user", content: msg }],
      });
      conversationId = conversation._id as string;
    }

    if (_id) {
      await addMessageConversationService(user, conversationId!, {
        role: "user",
        content: msg,
      });
    }

    const text = (await callAIWithPrompt(
      {
        aiProvider: "gemini",
        aiModel: "gemini-1.5-flash",
        history,
      },
      msg
    )) as string;

    await addMessageConversationService(user, conversationId!, {
      role: "assistant",
      content: text,
    });

    return {
      status: StatusCodes.OK,
      element: { reply: text, conversationId },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const chatStreamService = async (
  history: Message[],
  msg: string,
  _id?: string
) => {
  try {
    const stream = (await callAIWithPrompt(
      {
        aiProvider: "gemini",
        aiModel: "gemini-1.5-flash",
        history,
        stream: true,
      },
      msg
    )) as ReadableStream<Uint8Array>;
    return {
      element: { stream },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
