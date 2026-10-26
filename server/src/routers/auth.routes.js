import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { handleLogin, handleRegister, getMe } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), handleRegister)
router.post("/login", validate(loginSchema), handleLogin);
router.get("/me", requireAuth, getMe);

export default router; 