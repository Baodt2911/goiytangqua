import cron from "node-cron";
import { sendNotificationService } from "src/services";
import { _relationship } from "src/models";

const scheduleAnniversaries = cron.schedule("* * * * *", async () => {
  console.log("Đang kiểm tra các ngày kỉ niệm...");
  try {
    await sendNotificationService();
    console.log("Thông báo đã được gửi...");
  } catch (error) {
    console.error("Lỗi khi chạy cron job:", error);
  }
});
export default scheduleAnniversaries;
