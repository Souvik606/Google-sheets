import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler.js";
import healthCheckRoutes from "./routes/healthCheck.routes.js";
import { CORS_ORIGIN } from "../env.js";
import authRoutes from "./routes/auth.routes.js";
import spreadsheetRoutes from "./routes/spreadsheet.routes.js";
import sheetRoutes from "./routes/sheet.routes.js";
import cellRoutes from "./routes/cell.routes.js";

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/health-check", healthCheckRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/spreadsheet", spreadsheetRoutes);
app.use("/api/v1/:spreadsheetId/sheet", sheetRoutes);
app.use("/api/v1/:spreadsheetId/:sheetId/cell", cellRoutes);

app.use(errorHandler);

export { app };
