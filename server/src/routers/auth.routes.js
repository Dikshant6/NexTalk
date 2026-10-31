import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
    registerSchema,
    loginSchema,
    verifyEmailOtpSchema,
    resendEmailOtpSchema
} from "../schemas/auth.schema.js";
import {
    handleLogin,
    handleRegister,
    getMe,
    handleLogout,
    handleResendEmailOtp,
    handleVerifyEmail
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), handleRegister)
router.post("/login", validate(loginSchema), handleLogin);
router.get("/me", requireAuth, getMe);
router.get("/logout", handleLogout);
router.post("/verify-email", validate(verifyEmailOtpSchema), handleVerifyEmail,);
router.post("/resend-verification", validate(resendEmailOtpSchema), handleResendEmailOtp,);

export default router; 