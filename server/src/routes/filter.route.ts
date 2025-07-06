import { Router } from "express";
import {
  addFilterController,
  deleteFilterController,
  getFilterController,
  updateFilterController,
} from "src/controllers";
import {
  validateFilterRequest,
  validateObjectIdRequest,
  verifyAdmin,
} from "src/middlewares";
const router: Router = Router();
router.get("/", getFilterController);
router.post("/add", verifyAdmin, validateFilterRequest, addFilterController);
router.delete(
  "/delete/:id",
  verifyAdmin,
  validateObjectIdRequest,
  deleteFilterController
);
router.put(
  "/update/:id",
  verifyAdmin,
  validateObjectIdRequest,
  validateFilterRequest,
  updateFilterController
);

export default router;
