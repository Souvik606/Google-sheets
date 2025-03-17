import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createSpreadsheet,
  getSpreadsheets,
  updateSpreadsheetAccess,
  updateSpreadsheetDescription,
  updateSpreadsheetName,
  deleteSpreadsheet,
} from "../controllers/spreadsheet.controller.js";
import { verifyOwner } from "../middlewares/spreadsheet.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getSpreadsheets);
router.route("/create").post(verifyJWT, createSpreadsheet);
router
  .route("/:spreadsheetId/update-access")
  .post(verifyJWT, verifyOwner, updateSpreadsheetAccess);
router
  .route("/:spreadsheetId/rename")
  .patch(verifyJWT, verifyOwner, updateSpreadsheetName);
router
  .route("/:spreadsheetId/edit-description")
  .patch(verifyJWT, verifyOwner, updateSpreadsheetDescription);
router
  .route("/:spreadsheetId/delete")
  .delete(verifyJWT, verifyOwner, deleteSpreadsheet);

export default router;
