import { Router } from "express";
import { getPromptStatsController } from "src/controllers";
import { verifyAdmin } from "src/middlewares";
const router: Router = Router();
router.get("/overview/ai-prompt", verifyAdmin, getPromptStatsController);
export default router;
