import { Router } from "express";
import passport from "passport";
import {
  googleCallbackController,
  loginController,
  logoutController,
  registerController,
} from "src/controllers";
import {
  verifyRefreshToken,
  validateRegisterRequest,
  validateLoginRequest,
} from "src/middlewares";
const router: Router = Router();
router.post("/login", validateLoginRequest, loginController);
router.post("/register", validateRegisterRequest, registerController);
router.post("/logout", verifyRefreshToken, logoutController);
router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    failureMessage: true,
  }),
  googleCallbackController
);

export default router;
