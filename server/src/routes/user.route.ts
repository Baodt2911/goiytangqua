import { Router } from "express";
import passport from "passport";
import {
  getCurrentUserController,
  googleCallbackController,
  loginController,
  logoutController,
  registerController,
} from "src/controllers";
import { verifyRefreshToken } from "src/middlewares";
const router: Router = Router();
router.get("/me", verifyRefreshToken, getCurrentUserController);
router.post("/login", loginController);
router.post("/register", registerController);
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
