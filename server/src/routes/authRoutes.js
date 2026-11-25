import express from "express";
import { upload } from "../middleware/upload.js";
import {
  registerUser,
  loginUser,
  getUser,
  updateUser
} from "../controllers/authController.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "resume", maxCount: 1 }
]);

// Auth routes
router.post("/register", uploadFields, registerUser);
router.post("/login", loginUser);
router.get("/user/:id", getUser);
router.put("/user/:id", uploadFields, updateUser);

export default router;
