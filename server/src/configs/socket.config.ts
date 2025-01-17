export const configSocket = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("<<<<<Connected to socket>>>>>");

    socket.on("disconnect", () => {
      console.log("<<<<<Disconnected to socket>>>>>");
    });
  });
};
