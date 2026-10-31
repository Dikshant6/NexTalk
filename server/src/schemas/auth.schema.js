import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/),

  displayName: z.string().trim().min(1).max(50),

  email: z.string().trim().toLowerCase().email().max(254),

  password: z.string().min(8).max(128),
});

export const verifyEmailOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
})

export const resendEmailOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
})

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .email(),
  password: z.string().min(1).max(120)
})