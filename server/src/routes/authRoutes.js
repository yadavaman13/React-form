import express from "express";
import { upload } from "../middleware/upload.js";
import {
  registerValidation,
  loginValidation,
  idValidation
} from "../validators/authValidator.js";
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

// Auth routes with validations
router.post("/register", uploadFields, registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/user/:id", idValidation, getUser);
router.put("/user/:id", uploadFields, idValidation, updateUser);

export default router;
