import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getProductController,
  updateProductController,
} from "src/controllers";
import {
  validateObjectIdRequest,
  validateProductRequest,
  validateUpdateProductRequest,
  verifyAdmin,
} from "src/middlewares";
const router: Router = Router();
router.get("/slug/:slug", getProductController);
router.get("/all", getAllProductController);
router.post(
  "/create",
  verifyAdmin,
  validateProductRequest,
  createProductController
);
router.patch(
  "/update/:id",
  verifyAdmin,
  validateObjectIdRequest,
  validateUpdateProductRequest,
  updateProductController
);
router.delete(
  "/delete/:id",
  verifyAdmin,
  validateObjectIdRequest,
  deleteProductController
);
export default router;
