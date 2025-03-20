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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response?.status === 401 && !config._retry) {
      console.debug("Intercepted error response");
      localStorage.removeItem("auth");
      return Promise.reject(response);
    }
    return Promise.reject(error);
  }
);

export default api;
