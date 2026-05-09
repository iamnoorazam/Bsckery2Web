import { Router } from "express";
import {
  getAllUsers,
  blockUnblockUser,
  deleteUser,
  approveOwner,
  getPlatformStats,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/admin.controller.js";
import protect from "../middleware/auth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";

const router = Router();

router.use(protect, allowRoles("admin"));

router.get("/stats", getPlatformStats);

router.get("/users", getAllUsers);
router.put("/users/:id/block", blockUnblockUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/approve", approveOwner);

router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

export default router;
