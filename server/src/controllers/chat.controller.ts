import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ChatRequestDTO } from "src/dtos";
import {
  addMessageConversationService,
  chatService,
  chatStreamService,
  createConversationService,
  getMessagesConversationService,
} from "src/services";
import { Message } from "src/types";
export const chatController = async (
  req: Request<{}, {}, ChatRequestDTO>,
  res: Response
) => {
  try {
    const user = req.user;
    const { conversationId, msg } = req.body;

    const { status, element } = await chatService(user, msg, conversationId);
    res.status(status).json({ status, ...element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export const chatStreamController = async (
  req: Request<{}, {}, ChatRequestDTO>,
  res: Response
) => {
  try {
    const user = req.user;
    const { conversationId: clientConvId, msg } = req.body;

    let conversationId = clientConvId;
    let history: Message[] = [];

    if (conversationId) {
      const conv = await getMessagesConversationService(user, conversationId);
      history = conv?.element?.messages || [];
    } else {
      const {
        element: { conversation },
      } = await createConversationService(user, {
        title: msg,
        messages: [{ role: "user", content: msg }],
      });
      conversationId = (conversation._id as any).toString();
    }

    if (clientConvId) {
      await addMessageConversationService(user, conversationId, {
        role: "user",
        content: msg,
      });
    }

    const {
      element: { stream },
    } = await chatStreamService(history, msg, conversationId);

    // Cấu hình SSE headers
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    res.write("event: start\n");
    res.write(`data: ${JSON.stringify("Chat started")}\n\n`);

    const reader = stream.getReader();
    const decoder = new TextDecoder();

    let assistantReply = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        assistantReply += text;
        res.write(`data: ${JSON.stringify(text)}\n\n`);
      }

      await addMessageConversationService(user, conversationId, {
        role: "assistant",
        content: assistantReply,
      });

      // Kết thúc stream
      res.write("event: end\n");
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (err: any) {
      console.error("Stream error:", err);
      res.write("event: error\n");
      res.write(`data: ${JSON.stringify(err.message || "Stream error")}\n\n`);
      res.end();
    }
  } catch (error: any) {
    console.error("Controller error:", error);

    if (!res.headersSent) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message || "Unknown error" });
    } else {
      res.write("event: error\n");
      res.write(
        `data: ${JSON.stringify(error.message || "Unknown error")}\n\n`
      );
      res.end();
    }
  }
};
