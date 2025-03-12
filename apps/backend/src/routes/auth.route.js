import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const router = Router();

router.route("/signup").post(upload.single("profileIcon"), registerUser);
router.route("/login").post(loginUser);

export default router;
