import orderRepository from "../repositories/order.repository.js";
import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";
import notificationRepository from "../repositories/notification.repository.js";

const orderService = {
  placeOrder: async (customerId, { deliveryAddress, paymentMethod }) => {
    const cart = await cartRepository.findByUser(customerId);
    if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

    const firstProduct = await productRepository.findById(
      cart.items[0].product._id
    );
    if (!firstProduct) throw new Error("Product not found");

    const order = await orderRepository.create({
      customer: customerId,
      owner: firstProduct.owner,
      items: cart.items.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.price,
      })),
      deliveryAddress,
      totalPrice: cart.totalPrice,
      paymentMethod,
    });

    await cartRepository.deleteByUser(customerId);

    await notificationRepository.create({
      user: firstProduct.owner,
      message: `New order #${order._id} received`,
      type: "order",
    });

    return order;
  },

  getOrderById: async (id) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new Error("Order not found");
    return order;
  },

  getMyOrders: (customerId) => orderRepository.findByCustomer(customerId),

  getOwnerOrders: (ownerId) => orderRepository.findByOwner(ownerId),

  getAllOrders: () => orderRepository.findAll(),

  updateOrderStatus: async ({ orderId, status, userId, role }) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (role === "owner" && order.owner._id.toString() !== userId.toString()) {
      throw new Error("Not authorized");
    }

    const updated = await orderRepository.updateById(orderId, { orderStatus: status });

    await notificationRepository.create({
      user: order.customer._id,
      message: `Your order #${orderId} status updated to ${status}`,
      type: "order",
    });

    return updated;
  },

  cancelOrder: async (orderId, customerId) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");
    if (order.customer._id.toString() !== customerId.toString()) {
      throw new Error("Not authorized");
    }
    if (order.orderStatus !== "placed") {
      throw new Error("Order can only be cancelled when status is placed");
    }

    return orderRepository.updateById(orderId, { orderStatus: "cancelled" });
  },
};

export default orderService;
