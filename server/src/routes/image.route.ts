import { Router } from "express";
import { upload } from "src/configs";
import { deleteImageController, uploadImageController } from "src/controllers";
import { verifyAdmin } from "src/middlewares";
const router: Router = Router();
router.post(
  "/upload",
  verifyAdmin,
  upload.single("image"),
  uploadImageController
);
router.delete("/delete/:public_id", verifyAdmin, deleteImageController);
export default router;
