import { Router } from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/order.controller.js";
import protect from "../middleware/auth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";

const router = Router();

router.use(protect);

router.post("/", allowRoles("customer"), placeOrder);
router.get("/my", allowRoles("customer"), getMyOrders);
router.put("/:id/cancel", allowRoles("customer"), cancelOrder);

router.get("/all", allowRoles("admin"), getAllOrders);

router.get("/:id", getOrderById);
router.put("/:id/status", allowRoles("owner", "admin"), updateOrderStatus);

export default router;
