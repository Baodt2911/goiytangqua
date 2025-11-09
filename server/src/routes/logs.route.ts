import { Router } from "express";
import { getLogsController } from "src/controllers";
import { verifyAdmin } from "src/middlewares";

const router: Router = Router();
router.get("/errors", verifyAdmin, getLogsController);
export default router;
