import { Router } from "express";
import {
  createPromptController,
  deletePromptController,
  getAllPromptController,
  getPromptController,
  updatePromptController,
} from "src/controllers";
import { verifyAdmin } from "src/middlewares";
const router: Router = Router();
router.get("/all", verifyAdmin, getAllPromptController);
router.get("/:id", verifyAdmin, getPromptController);
router.post("/create", verifyAdmin, createPromptController);
router.patch("/update/:id", verifyAdmin, updatePromptController);
router.delete("/delete/:id", verifyAdmin, deletePromptController);

export default router;
