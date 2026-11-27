import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  uploadAvatar,
  validateAvatarContent,
} from "../middlewares/upload.middleware.js";
import { updateProfileSchema } from "../schemas/profile.schema.js";
import {
  getMyProfile,
  updateMyProfile,
  uploadProfileAvatar,
} from "../controllers/profile.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/me", getMyProfile);
router.patch("/me", validate(updateProfileSchema), updateMyProfile);
router.post(
  "/avatar",
  uploadAvatar,
  validateAvatarContent,
  uploadProfileAvatar,
);
export default router;
