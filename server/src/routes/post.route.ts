import { Router } from "express";
import {
  createCommentController,
  createPostController,
  deletePostController,
  getAllPostsController,
  getCommentsController,
  getPostController,
  updatePostController,
} from "src/controllers";
import {
  validateObjectIdRequest,
  validatePostRequest,
  validateUpdatePostRequest,
  verifyAccessToken,
  verifyAdmin,
} from "src/middlewares";
const router: Router = Router();
router.get("/slug/:slug", getPostController);
router.get("/all", getAllPostsController);
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
