import { Socket } from "socket.io";
import { notificationEvent } from "./notification.event";
import { chatEvent } from "./chat.event";

const socketEvents = (socket: Socket) => {
  notificationEvent(socket);
  chatEvent(socket);
};
export default socketEvents;
