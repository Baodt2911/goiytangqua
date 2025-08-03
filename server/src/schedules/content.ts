import cron from "node-cron";
import { checkScheduleService } from "src/services";
import { _relationship } from "src/models";

const scheduleGenerateContent = cron.schedule("* * * * *", async () => {
  console.log("Đang kiểm tra các content schedule...");
  try {
    await checkScheduleService();
    console.log("Bài viết đã được tạo...");
  } catch (error) {
    console.error("Lỗi khi chạy cron job:", error);
  }
});

export default scheduleGenerateContent;
