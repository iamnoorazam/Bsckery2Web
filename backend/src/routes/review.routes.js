import { Router } from "express";
import {
  getProductReviews,
  addReview,
  editReview,
  deleteReview,
} from "../controllers/review.controller.js";
import protect from "../middleware/auth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";

const router = Router();

router.get("/:productId", getProductReviews);

router.post("/:productId", protect, allowRoles("customer"), addReview);
router.put("/:id", protect, editReview);
router.delete("/:id", protect, deleteReview);

export default router;
