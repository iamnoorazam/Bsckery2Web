import { Router } from "express";
import {
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";
import protect from "../middleware/auth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";

const router = Router();

router.use(protect, allowRoles("customer"));

router.post("/create/:orderId", createRazorpayOrder);
router.post("/verify", verifyPayment);

export default router;
