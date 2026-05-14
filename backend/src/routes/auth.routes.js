import { Router } from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
