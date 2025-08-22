import { Router } from "express";
import {
  createCommentController,
  createPostController,
  deletePostController,
  getAllPostsController,
  getCommentsController,
  getPostController,
  // increaseViewController,
  updatePostController,
} from "src/controllers";
import {
  authOptional,
  validateObjectIdRequest,
  validatePostRequest,
  validateUpdatePostRequest,
  verifyAccessToken,
  verifyAdmin,
} from "src/middlewares";
const router: Router = Router();
router.get("/slug/:slug", getPostController);
// router.post("/slug/:slug/view", authOptional, increaseViewController);
router.get("/all", authOptional, getAllPostsController);
router.get("/:id/comments", validateObjectIdRequest, getCommentsController);
router.post(
  "/:id/comments",
  verifyAccessToken,
  validateObjectIdRequest,
  createCommentController
);
router.post("/create", verifyAdmin, validatePostRequest, createPostController);
router.patch(
  "/update/:id",
  verifyAdmin,
  validateObjectIdRequest,
  validateUpdatePostRequest,
  updatePostController
);
router.delete(
  "/delete/:id",
  verifyAdmin,
  validateObjectIdRequest,
  deletePostController
);
export default router;
