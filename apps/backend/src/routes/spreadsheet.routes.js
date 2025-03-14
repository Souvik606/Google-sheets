import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createSpreadsheet,
  updateSpreadsheetAccess,
} from "../controllers/spreadsheet.controller.js";
import { verifyOwner } from "../middlewares/spreadsheet.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createSpreadsheet);
router
  .route("/:spreadsheetId/update-access")
  .post(verifyJWT, verifyOwner, updateSpreadsheetAccess);

export default router;
