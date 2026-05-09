import userRepository from "../repositories/user.repository.js";
import orderRepository from "../repositories/order.repository.js";
import productRepository from "../repositories/product.repository.js";

const adminService = {
  getAllUsers: (role) => {
    const filter = role ? { role } : {};
    return userRepository.findAll(filter);
  },

  blockUnblockUser: async (userId, isBlocked) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return userRepository.updateById(userId, { isBlocked });
  },

  deleteUser: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return userRepository.deleteById(userId);
  },

  approveOwner: async (ownerId) => {
    const user = await userRepository.findById(ownerId);
    if (!user) throw new Error("User not found");
    if (user.role !== "owner") throw new Error("User is not a bakery owner");
    return userRepository.updateById(ownerId, { isApproved: true });
  },

  getPlatformStats: async () => {
    const [totalOrders, totalProducts, totalUsers] = await Promise.all([
      orderRepository.findAll(),
      productRepository.count(),
      userRepository.findAll(),
    ]);

    const totalRevenue = totalOrders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    return {
      totalOrders: totalOrders.length,
      totalProducts,
      totalUsers: totalUsers.length,
      totalRevenue,
    };
  },
};

export default adminService;
