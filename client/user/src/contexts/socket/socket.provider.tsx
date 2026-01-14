import React, { useEffect } from "react";
import {
  connectSocket,
  disconnectSocket,
} from "../../features/socket/socket.service";
import { useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  useEffect(() => {
    if (!isAuthenticated) return;
    connectSocket();
    return () => disconnectSocket();
  }, [isAuthenticated]);

  return <>{children}</>;
};
