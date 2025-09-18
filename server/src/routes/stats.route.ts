import { Router } from "express";
import {
  getStatsAIController,
  getStatsOverviewController,
  getStatsPostController,
  getStatsActivitiesController,
  getStatsTopContentController,
} from "src/controllers";
import { verifyAdmin } from "src/middlewares";
const router: Router = Router();
router.get("/ai", verifyAdmin, getStatsAIController);
router.get("/overview", verifyAdmin, getStatsOverviewController);
router.get("/posts", verifyAdmin, getStatsPostController);
router.get("/activities", verifyAdmin, getStatsActivitiesController);
router.get("/top-content", verifyAdmin, getStatsTopContentController);
export default router;
