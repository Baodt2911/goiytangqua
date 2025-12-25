import {
  addMessageConversationService,
  createConversationService,
  getMessagesConversationService,
} from "src/services";
import { CustomSocketType, Message } from "src/types";
import { callAIWithPrompt } from "src/utils";

export const chatEvent = (socket: CustomSocketType) => {
  socket.on(
    "chatMessage",
    async ({
      msg,
      conversationId,
    }: {
      msg: string;
      conversationId?: string;
    }) => {
      try {
        const user = socket.user;

        let history: Message[] = [];
        let convId = conversationId;

        if (convId) {
          const conv = await getMessagesConversationService(user, convId);
          history = conv?.element?.messages || [];
        } else {
          const {
            element: { conversation },
          } = await createConversationService(user, {
            title: msg,
            messages: [{ role: "user", content: msg }],
          });
          convId = (conversation._id as any).toString();
        }

        if (conversationId) {
          await addMessageConversationService(user, convId!, {
            role: "user",
            content: msg,
          });
        }

        const stream = (await callAIWithPrompt(
          {
            aiProvider: "gemini",
            aiModel: "gemini-2.5-flash",
            history,
            stream: true,
          },
          msg
        )) as ReadableStream<Uint8Array>;

        const reader = stream.getReader();
        const decoder = new TextDecoder();

        // cleanup nếu client ngắt kết nối
        const onDisconnect = async () => {
          try {
            await reader?.cancel();
          } catch {}
        };
        socket.once("disconnect", onDisconnect);

        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            socket.emit("botReplyDone", { conversationId: convId });
            break;
          }
          const chunk = decoder.decode(value);
          fullText += chunk;
          socket.emit("botReply", { chunk, conversationId: convId });
        }

        await addMessageConversationService(user, convId!, {
          role: "assistant",
          content: fullText,
        });
      } catch (error: any) {
        console.error("Socket chatMessage error:", error);
        socket.emit("botReplyError", error.message || "Unknown error");
      }
    }
  );
};
