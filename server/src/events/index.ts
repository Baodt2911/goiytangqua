import { Socket } from "socket.io";
import { notificationEvent } from "./notification";

const socketEvents = (socket: Socket) => {
  notificationEvent(socket);
};
export default socketEvents;
