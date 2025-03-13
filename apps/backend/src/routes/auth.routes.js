import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(upload.single("profileIcon"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").delete(verifyJWT, logoutUser);

export default router;
