import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAccess } from "../middlewares/spreadsheet.middleware.js";
import { createSheet } from "../controllers/sheet.controller.js";

const router = Router({ mergeParams: true });

router.route("/create").post(verifyJWT, verifyAccess, createSheet);

export default router;
