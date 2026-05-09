import { Router } from "express";
import {
  getMyNotifications,
  markAllRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getMyNotifications);
router.put("/read-all", markAllRead);
router.delete("/:id", deleteNotification);

export default router;
