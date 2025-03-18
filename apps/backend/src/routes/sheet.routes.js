import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAccess } from "../middlewares/spreadsheet.middleware.js";
import {
  createSheet,
  getAllComments,
  postComment,
  renameSheet,
  getAllSheets,
} from "../controllers/sheet.controller.js";

const router = Router({ mergeParams: true });

router.route("/").get(verifyJWT, verifyAccess, getAllSheets);
router.route("/create").post(verifyJWT, verifyAccess, createSheet);
router.route("/:sheetId/rename").patch(verifyJWT, verifyAccess, renameSheet);
router.route("/:sheetId/comment").post(verifyJWT, verifyAccess, postComment);
router.route("/comment").get(verifyJWT, verifyAccess, getAllComments);

export default router;
