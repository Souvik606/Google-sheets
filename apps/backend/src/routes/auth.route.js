import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser } from "../controllers/auth.controller.js";

const router = Router();

router.route("/signup").post(upload.single("profileIcon"), registerUser);

export default router;
