import { z } from "zod";

export const registrationBodySchema = z.object({
  email: z.string().email("Email is invalid."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  name: z.string().min(1, "Name is required."),
});

export const loginBodySchema = z.object({
  email: z.string().email("Email is invalid."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});
