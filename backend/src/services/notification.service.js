import notificationRepository from "../repositories/notification.repository.js";

const notificationService = {
  getMyNotifications: (userId) => notificationRepository.findByUser(userId),

  markAllRead: (userId) => notificationRepository.markAllRead(userId),

  delete: async (notifId, userId) => {
    await notificationRepository.deleteById(notifId);
  },
};

export default notificationService;
