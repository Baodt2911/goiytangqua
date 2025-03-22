import { Router } from "express";
import {
  getNotificationController,
  updateReadNotificationController,
} from "src/controllers";
import { validateObjectIdRequest, verifyAccessToken } from "src/middlewares";
const router: Router = Router();
router.get("/", verifyAccessToken, getNotificationController);
router.post(
  "/update/read/:id",
  verifyAccessToken,
  validateObjectIdRequest,
  updateReadNotificationController
);
export default router;
