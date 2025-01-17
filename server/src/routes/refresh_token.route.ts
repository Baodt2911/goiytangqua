import { Router } from "express";
import {
  refreshTokenController,
  refreshGoogleAccessTokenController,
} from "src/controllers";
import { verifyRefreshToken } from "src/middlewares";
const router: Router = Router();
router.post("/refresh-token", verifyRefreshToken, refreshTokenController);
router.post("/refresh-token/google", refreshGoogleAccessTokenController);
export default router;
