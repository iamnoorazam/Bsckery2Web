import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import protect from "../middleware/auth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  allowRoles("owner", "admin"),
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  protect,
  allowRoles("owner", "admin"),
  upload.array("images", 5),
  updateProduct
);

router.delete("/:id", protect, allowRoles("owner", "admin"), deleteProduct);

export default router;
