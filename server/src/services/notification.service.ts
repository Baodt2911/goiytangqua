import { getRelationshipsWithAnniversaryToday } from "src/services";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NotificationRequestDTO } from "src/dtos";
import { _notification, _relationship } from "src/models";
import { io } from "src/server";
import { callAIWithPrompt } from "src/utils";

export const createNotificationService = async (
  data: NotificationRequestDTO
) => {
  try {
    await _notification.create(data);
    return {
      status: StatusCodes.OK,
      element: {
        title: data.title,
        message: data.message,
      },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const getNotificationService = async (userId: string) => {
  try {
    const existingsNotification = await _notification
      .find({ userId })
      .sort({ createdAt: -1 });
    return {
      status: StatusCodes.OK,
      element: existingsNotification,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const updateReadNotificationService = async (
  userId: string,
  notificationId: string
) => {
  try {
    const isUpdated = await _notification.findOneAndUpdate(
      {
        $and: [{ _id: notificationId }, { userId }],
      },
      {
        read: true,
      }
    );
    if (!isUpdated) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Thông báo không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Cập nhật thông báo thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const sendNotificationService = async () => {
  try {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const exitstingAnniversaries = await getRelationshipsWithAnniversaryToday(
      day,
      month
    );

    for (const data of exitstingAnniversaries) {
      for (const item of data.anniversaries) {
        if (item.date.day === day && item.date.month === month) {
          // Kiểm tra lastNotified
          const last = item.lastNotified
            ? item.lastNotified.toISOString().split("T")[0]
            : null;
          const today = now.toISOString().split("T")[0];
          if (last === today) {
            console.log(`Đã gửi thông báo cho ${data.name} hôm nay, bỏ qua...`);
            continue; // Đã gửi thông báo hôm nay, bỏ qua
          }
          const prompt = `Tạo các thông báo {title, message} dựa trên dữ liệu sau: ${JSON.stringify(
            {
              name: data.name,
              relationshipType: data.relationshipType,
              preferences: data.preferences,
              anniversaries: {
                name: item.name,
                date: {
                  day: day,
                  month: month,
                },
              },
            }
          )}. Tôi chỉ cần 1 thông báo duy nhất. Loại bỏ những thông tin không cần thiết, viết các thông báo trông bắt mắt, có hồn hơn, thêm các icon cần thiết, tối đa 2 icon. Đây chỉ là thông báo nhắc nhờ tôi`;

          const result = await callAIWithPrompt(
            { aiProvider: "gemini", aiModel: "gemini-2.5-flash" },
            prompt
          );
          console.log("Kết quả từ AI:", result);
          const titleRegex = /"title": "(.*?)"/;
          const messageRegex = /"message": "(.*?)"/;

          const titleMatch = (result as string).match(titleRegex);
          const messageMatch = (result as string).match(messageRegex);

          const title = titleMatch ? titleMatch[1] : "";
          const message = messageMatch ? messageMatch[1] : "";
          console.log({ title, message });
          await createNotificationService({
            userId: data.userId.toString(),
            relationshipId: data._id.toString(),
            title,
            message,
          });
          const { element } = await getNotificationService(
            data.userId.toString()
          );
          // Gửi thông báo qua socket
          io.to(data.userId.toString()).emit("notification", element);

          // Cấp nhật lastNotified
          await _relationship.updateOne(
            {
              $and: [{ _id: data._id }, { "anniversaries._id": item._id }],
            },
            {
              $set: { "anniversaries.$.lastNotified": new Date() },
            }
          );
        }
      }
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
