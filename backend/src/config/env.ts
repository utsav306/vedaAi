import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGO_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/vedaai"),
  JWT_SECRET: z.string().min(16).default("vedaai-local-dev-secret-change-me"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  REDIS_URL: z.string().url().default("redis://127.0.0.1:6379"),
  GEMINI_API_KEY: z.string().optional().default(""),
  GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
  PDF_OUTPUT_DIR: z.string().default("uploads/pdfs"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Environment validation failed", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
