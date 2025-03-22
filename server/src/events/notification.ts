import { getNotificationService } from "src/services";
import { CustomSocket } from "src/types";

export const notificationEvent = (socket: CustomSocket) => {
  socket.on("notification", async () => {
    try {
      const { userId } = socket.decoded;
      const { element } = await getNotificationService(userId);
      socket.emit("notification", element);
    } catch (error: any) {
      throw new Error(error);
    }
  });
};
