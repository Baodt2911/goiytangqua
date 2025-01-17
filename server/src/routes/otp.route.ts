import { Router } from "express";
import { sendOtpController } from "src/controllers";
const router: Router = Router();
router.post("/send-otp", sendOtpController);
export default router;
