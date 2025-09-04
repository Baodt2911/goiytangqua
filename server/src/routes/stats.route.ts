import { Router } from "express";
import { getStatsOverviewAIController } from "src/controllers";
import { verifyAdmin } from "src/middlewares";
const router: Router = Router();
router.get("/overview/ai", verifyAdmin, getStatsOverviewAIController);
export default router;
