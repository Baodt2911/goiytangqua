import { changeActivePromptController } from "./../controllers/ai_prompt.controller";
import { Router } from "express";
import {
  createPromptController,
  deletePromptController,
  getAllPromptController,
  getPromptController,
  updatePromptController,
} from "src/controllers";
import {
  validateAIPromptRequest,
  validateUpdateAIPromptRequest,
  validateObjectIdRequest,
  verifyAdmin,
} from "src/middlewares";
const router: Router = Router();
router.get("/all", verifyAdmin, getAllPromptController);
router.get("/:id", verifyAdmin, getPromptController);
router.post(
  "/create",
  verifyAdmin,
  validateAIPromptRequest,
  createPromptController
);
router.patch(
  "/change-active/:id",
  verifyAdmin,
  validateObjectIdRequest,
  changeActivePromptController
);
router.patch(
  "/update/:id",
  verifyAdmin,
  validateObjectIdRequest,
  validateUpdateAIPromptRequest,
  updatePromptController
);
router.delete(
  "/delete/:id",
  verifyAdmin,
  validateObjectIdRequest,
  deletePromptController
);

export default router;
