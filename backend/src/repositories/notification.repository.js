import Notification from "../models/Notification.js";

const notificationRepository = {
  create: (data) => Notification.create(data),

  findByUser: (userId) =>
    Notification.find({ user: userId }).sort({ createdAt: -1 }),

  markAllRead: (userId) =>
    Notification.updateMany({ user: userId }, { isRead: true }),

  deleteById: (id) => Notification.findByIdAndDelete(id),
};

export default notificationRepository;
