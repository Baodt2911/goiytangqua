import cron from "node-cron";
import { checkSchedulePostService } from "src/services";

const schedulePublishPost = cron.schedule("* * * * *", async () => {
  console.log("Đang kiểm tra các post schedule...");
  try {
    await checkSchedulePostService();
  } catch (error) {
    console.error("Lỗi khi chạy cron job:", error);
  }
});

export default schedulePublishPost;
