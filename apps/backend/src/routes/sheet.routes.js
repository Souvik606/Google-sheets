import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAccess } from "../middlewares/spreadsheet.middleware.js";
import {
  createSheet,
  postComment,
  renameSheet,
} from "../controllers/sheet.controller.js";

const router = Router({ mergeParams: true });

router.route("/create").post(verifyJWT, verifyAccess, createSheet);
router.route("/:sheetId/rename").patch(verifyJWT, verifyAccess, renameSheet);
router.route("/:sheetId/comment").post(verifyJWT, verifyAccess, postComment);

export default router;
