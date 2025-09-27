import { Router } from "express";
import {
  chatController,
  chatStreamController,
  getAllConversationsController,
  getMessagesConversationController,
  deleteConversationController,
} from "src/controllers";
import { validateObjectIdRequest, verifyAccessToken } from "src/middlewares";
import { validateChatRequest } from "src/middlewares";
const router: Router = Router();
router.get("/conversations", verifyAccessToken, getAllConversationsController);
router.get(
  "/conversations/:id",
  verifyAccessToken,
  validateObjectIdRequest,
  getMessagesConversationController
);
router.delete(
  "/conversations/delete/:id",
  verifyAccessToken,
  validateObjectIdRequest,
  deleteConversationController
);
router.post("/default", verifyAccessToken, validateChatRequest, chatController);
router.post(
  "/stream",
  verifyAccessToken,
  validateChatRequest,
  chatStreamController
);

export default router;
