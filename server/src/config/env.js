import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGO_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  FRONTEND_URL: z.string().min(1),
  BREVO_SMTP_HOST: z.string().min(1),
  BREVO_SMTP_PORT: z.coerce.number().int().min(1).max(65535),
  BREVO_SMTP_USER: z.string().min(1),
  BREVO_SMTP_KEY: z.string().min(1),
  EMAIL_FROM: z.string().email(),
  OTP_HASH_SECRET: z.string().min(32),
  EMAIL_TEST_RECIPIENT: z.string().email(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment configuration:");
  console.error(result.error.issues);
  process.exit(1);
}

export const env = result.data;
