import { createContext } from "react";
import { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
});
