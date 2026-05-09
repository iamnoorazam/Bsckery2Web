import notificationService from "../services/notification.service.js";
import sendResponse from "../utils/sendResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getMyNotifications(req.user._id);
  sendResponse(res, 200, "Notifications fetched", notifications);
});

export const markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user._id);
  sendResponse(res, 200, "All notifications marked as read");
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.delete(req.params.id, req.user._id);
  sendResponse(res, 200, "Notification deleted");
});
