import { io, Socket } from "socket.io-client";
import { store } from "../../app/store";
import { setConnected, setDisconnected } from "./socket.slice";
import {
  appendAssistantStream,
  finishAssistantStream,
  setMessageError,
  startAssistantStream,
  addUserMessageOptimistic,
} from "../chat/message.slice";
import {
  setNotification,
  Notification,
} from "../notification/notification.slice";

let socket: Socket | null = null;
export const connectSocket = () => {
  const token = store.getState().auth.accessToken;
  if (!socket && token) {
    socket = io(import.meta.env.VITE_URL_API, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("🔗 Connected to server");
      socket?.emit("join-server");
      store.dispatch(setConnected());
    });
    socket.emit("notification");
    socket.on("notification", (notifications: Notification[]) => {
      store.dispatch(setNotification(notifications));
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      store.dispatch(setDisconnected());
    });

    // Chat streaming events
    socket.on(
      "botReply",
      ({
        chunk,
        conversationId,
      }: {
        chunk: string;
        conversationId?: string;
      }) => {
        // start stream if not started
        store.dispatch(startAssistantStream({ conversationId }));
        store.dispatch(appendAssistantStream(chunk));
      }
    );
    socket.on("botReplyDone", () => {
      store.dispatch(finishAssistantStream());
    });
    socket.on("botReplyError", (message: string) => {
      store.dispatch(setMessageError(message));
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
export const getSocket = () => socket;

export const sendChatMessage = ({
  msg,
  conversationId,
}: {
  msg: string;
  conversationId?: string;
}) => {
  const s = getSocket();
  if (!s) return;
  // optimistic user message
  store.dispatch(addUserMessageOptimistic({ content: msg }));
  s.emit("chatMessage", { msg, conversationId });
};
