import { io, Socket } from "socket.io-client";
import { store } from "../../app/store";
import { setConnected, setDisconnected } from "./sockets.slice";
import {
  setNotification,
  Notification,
} from "../notifications/notifications.slice";

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
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
export const getSocket = () => socket;
