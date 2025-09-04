import React, { useEffect } from "react";
import {
  connectSocket,
  disconnectSocket,
} from "../../features/socket/socket.service";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  return <>{children}</>;
};
