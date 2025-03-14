import { z } from "zod";

export const spreadSheetBodySchema = z.object({
  name: z.string().min(3, "Name must be at least 2 characters long."),
  description: z
    .string()
    .max(200, "Description can be upto 200 characters.")
    .optional(),
});

export const spreadSheetNameBodySchema = z.object({
  name: z.string().min(3, "Name must be at least 2 characters long."),
});

export const spreadSheetDescriptionBodySchema = z.object({
  description: z.string().max(200, "Description can be upto 200 characters."),
});

export const userSchema = z.object({
  email: z.string().email("Email is invalid."),
  role: z.enum(["viewer", "editor", "suggestor"], {
    message: "Role must be one of: viewer, editor, or suggestor.",
  }),
});

export const usersAccessBodySchema = z.object({
  users: z
    .array(userSchema, { message: "Users must be an array of user objects." })
    .min(1, "Users array cannot be empty."),
});
