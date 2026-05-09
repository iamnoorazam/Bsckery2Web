import { Router } from "express";
import {
  getCart,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from "../controllers/cart.controller.js";
import protect from "../middleware/auth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";

const router = Router();

router.use(protect, allowRoles("customer"));

router.get("/", getCart);
router.post("/add", addItem);
router.delete("/remove/:productId", removeItem);
router.put("/quantity/:productId", updateQuantity);
router.delete("/clear", clearCart);

export default router;
