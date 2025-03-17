import { z } from "zod";

export const sheetNameBodySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
});

export const sheetRenameBodySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
});

export const commentBodySchema = z.object({
  content: z
    .string()
    .min(1, "Comment can't be empty")
    .max(250, "Comments can't be more than 250 characters"),
});
