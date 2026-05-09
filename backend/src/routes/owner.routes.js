import { Router } from "express";
import {
  getDashboard,
  getOwnerOrders,
  updateOrderStatus,
  getOwnerProducts,
} from "../controllers/owner.controller.js";
import protect from "../middleware/auth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";

const router = Router();

router.use(protect, allowRoles("owner"));

router.get("/dashboard", getDashboard);
router.get("/orders", getOwnerOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.get("/products", getOwnerProducts);

export default router;
