import orderRepository from "../repositories/order.repository.js";
import productRepository from "../repositories/product.repository.js";

const ownerService = {
  getDashboard: async (ownerId) => {
    const orders = await orderRepository.findByOwner(ownerId);
    const products = await productRepository.count({ owner: ownerId });

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const todayOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt).toDateString();
      return orderDate === new Date().toDateString();
    });

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalProducts: products,
      totalRevenue,
    };
  },

  getOwnerOrders: (ownerId) => orderRepository.findByOwner(ownerId),

  updateOrderStatus: async (orderId, ownerId, status) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");
    if (order.owner._id.toString() !== ownerId.toString()) {
      throw new Error("Not authorized");
    }
    return orderRepository.updateById(orderId, { orderStatus: status });
  },

  getOwnerProducts: (ownerId) =>
    productRepository.findAll({ owner: ownerId }),
};

export default ownerService;
