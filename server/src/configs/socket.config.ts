import socketEvents from "src/events";
import { verifyAccessTokenSocket } from "src/middlewares";
import { CustomSocket } from "src/types";

export const configSocket = (io: any) => {
  io.use(verifyAccessTokenSocket);
  io.on("connection", (socket: CustomSocket) => {
    console.log("<<<<<Connected to socket>>>>> : ", socket.id);

    socket.on("join-server", () => {
      const { userId } = socket.decoded;
      socket.join(userId);
      console.log(`User ${userId} đã vào server`);
    });

    socketEvents(socket);

    socket.on("disconnect", () => {
      console.log("<<<<<Disconnected to socket>>>>>");
    });
  });
};
