import { z } from "zod";

const cellDataFormat = z.enum([
  "Number",
  "Percent",
  "Scientific",
  "Currency",
  "Date",
  "Time",
  "",
]);

export const cellBodySchema = z.object({
  row: z.number().int(),
  col: z.number().int(),
  value: z.string(),
  data_format: cellDataFormat.optional(),
});
