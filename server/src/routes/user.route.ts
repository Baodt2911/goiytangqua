import { Router } from "express";
import {
  addNewRealationshipController,
  changePasswordController,
  deleteRelationshipController,
  getCurrentUserController,
  getRelationshipController,
  removeAnniversariesController,
  requestResetPasswordController,
  resetPasswordController,
  updateProfileController,
  updateRelationshipController,
} from "src/controllers";
import {
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetToken,
  validateUpdateProfileRequest,
  validateChangePaswordRequest,
  validateRequestResetPasswordRequest,
  validateResetPaswordRequest,
  validateAddNewRelationshipRequest,
  validateObjectIdRequest,
  validateUpdateRelationshipRequest,
  validateRemoveAnniversariesRequest,
} from "src/middlewares";
const router: Router = Router();
router.get("/me", verifyRefreshToken, getCurrentUserController);
router.post(
  "/update-profile",
  verifyAccessToken,
  validateUpdateProfileRequest,
  updateProfileController
);
router.post(
  "/change-password",
  verifyAccessToken,
  validateChangePaswordRequest,
  changePasswordController
);
router.post(
  "/request-reset-password",
  validateRequestResetPasswordRequest,
  requestResetPasswordController
);
router.post(
  "/reset-password",
  verifyResetToken,
  validateResetPaswordRequest,
  resetPasswordController
);

router.post(
  "/relationship/add-new",
  verifyAccessToken,
  validateAddNewRelationshipRequest,
  addNewRealationshipController
);
router.get("/relationship/get", verifyAccessToken, getRelationshipController);
router.post(
  "/relationship/update/:id",
  verifyAccessToken,
  validateUpdateRelationshipRequest,
  updateRelationshipController
);
router.delete(
  "/relationship/delete/:id",
  verifyAccessToken,
  validateObjectIdRequest,
  deleteRelationshipController
);
router.post(
  "/relationship/:id_relationship/remove-anniversaries/:id_anniversaries",
  verifyAccessToken,
  validateRemoveAnniversariesRequest,
  removeAnniversariesController
);
export default router;
