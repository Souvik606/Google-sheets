import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAccess } from "../middlewares/spreadsheet.middleware.js";
import { addCell } from "../controllers/cell.controller.js";

const router = Router({ mergeParams: true });

router.route("/add").post(verifyJWT, verifyAccess, addCell);

export default router;
