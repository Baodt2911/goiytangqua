import cron from "node-cron";
import { checkScheduleService } from "src/services";

const scheduleGenerateContent = cron.schedule("* * * * *", async () => {
  console.log("Đang kiểm tra các content schedule...");
  try {
    await checkScheduleService();
  } catch (error) {
    console.error("Lỗi khi chạy cron job:", error);
  }
});

export default scheduleGenerateContent;
