import { z } from "zod";

export const sheetNameBodySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
});

export const sheetRenameBodySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
});
