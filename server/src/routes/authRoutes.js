import express from "express";
import { upload } from "../middleware/upload.js";
import { registerUser } from "../controllers/authController.js";

const router = express.Router();

// Handles multipart/form-data with profileImage and resume fields
router.post(
  "/register",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  registerUser
);

export default router;
