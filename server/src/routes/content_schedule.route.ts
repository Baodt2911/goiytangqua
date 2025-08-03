import { Router } from "express";
import {
  createScheduleController,
  deleteScheduleController,
  getScheduleController,
  updateScheduleController,
} from "src/controllers";
import { verifyAdmin } from "src/middlewares";
const router: Router = Router();
router.get("/:aiPromptId", verifyAdmin, getScheduleController);
router.post("/create", verifyAdmin, createScheduleController);
router.patch("/update/:id", verifyAdmin, updateScheduleController);
router.delete("/delete/:id", verifyAdmin, deleteScheduleController);

export default router;
