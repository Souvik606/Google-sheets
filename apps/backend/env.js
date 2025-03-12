import { configDotenv } from "dotenv";
import { z } from "zod";

configDotenv({ path: "./.env" });

const envSchema = z.object({
  PORT: z.preprocess((val) => Number(val), z.number().default(8000)),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string(),
  NODE_ENV: z.enum(["development", "production", "testing"]),
  ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
  REFRESH_TOKEN_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  const errorMessages = envVars.error.errors
    .map((err) => {
      return `\t- ${err.path.join(".")}: ${err.message}`;
    })
    .join("\n");

  console.error(`❌  Invalid environment variables:\n${errorMessages}`);
  process.exit(1);
}

export const {
  PORT,
  DATABASE_URL,
  CORS_ORIGIN,
  NODE_ENV,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} = envVars.data;
