import axios from "axios";
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
});

const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

if (!parsedEnv.success) {
  throw new Error(
    `Invalid API base URL: ${parsedEnv.error.format().NEXT_PUBLIC_API_BASE_URL?._errors.join(", ")}`
  );
}

const API_BASE_URL = parsedEnv.data.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
