import { Router } from "express";
import {
  addMessageConversationController,
  chatController,
  chatStreamController,
  getAllConversationsController,
  getMessagesConversationController,
} from "src/controllers";
import {
  validateAddMessageConversationRequest,
  validateObjectIdRequest,
  verifyAccessToken,
} from "src/middlewares";
import { validateChatRequest } from "src/middlewares";
const router: Router = Router();
router.get("/conversations", verifyAccessToken, getAllConversationsController);
router.get(
  "/conversations/:id",
  verifyAccessToken,
  validateObjectIdRequest,
  getMessagesConversationController
);
router.post("/default", verifyAccessToken, validateChatRequest, chatController);
router.post(
  "/stream",
  verifyAccessToken,
  validateChatRequest,
  chatStreamController
);
export default router;
