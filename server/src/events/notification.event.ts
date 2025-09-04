import { getNotificationService } from "src/services";
import { CustomSocketType } from "src/types";

export const notificationEvent = (socket: CustomSocketType) => {
  socket.on("notification", async () => {
    try {
      const { userId } = socket.user;
      const { element } = await getNotificationService(userId);
      socket.emit("notification", element);
    } catch (error: any) {
      throw new Error(error);
    }
  });
};
