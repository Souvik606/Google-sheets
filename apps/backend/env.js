import { configDotenv } from "dotenv";
import { z } from "zod";

configDotenv({ path: "./.env" });

const envSchema = z.object({
  PORT: z.preprocess((val) => Number(val), z.number().default(8000)),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string(),
  // Add additional environment variables here as needed
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

export const { PORT, DATABASE_URL, CORS_ORIGIN } = envVars.data;
