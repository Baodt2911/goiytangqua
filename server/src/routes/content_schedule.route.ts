import { Router } from "express";
import {
  createScheduleController,
  deleteScheduleController,
  getScheduleController,
  updateScheduleController,
} from "src/controllers";
import {
  validateContentScheduleRequest,
  validateObjectIdRequest,
  validateUpdateContentScheduleRequest,
  verifyAdmin,
} from "src/middlewares";
const router: Router = Router();
router.get("/:aiPromptId", verifyAdmin, getScheduleController);
router.post(
  "/create",
  verifyAdmin,
  validateContentScheduleRequest,
  createScheduleController
);
router.patch(
  "/update/:id",
  verifyAdmin,
  validateObjectIdRequest,
  validateUpdateContentScheduleRequest,
  updateScheduleController
);
router.delete(
  "/delete/:id",
  verifyAdmin,
  validateObjectIdRequest,
  deleteScheduleController
);

export default router;
