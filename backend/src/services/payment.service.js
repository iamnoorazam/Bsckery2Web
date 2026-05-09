import crypto from "crypto";
import getRazorpay from "../config/razorpay.js";
import paymentRepository from "../repositories/payment.repository.js";
import orderRepository from "../repositories/order.repository.js";

const paymentService = {
  createRazorpayOrder: async (orderId, customerId) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");

    const rzpOrder = await getRazorpay().orders.create({
      amount: order.totalPrice * 100,
      currency: "INR",
      receipt: orderId.toString(),
    });

    await orderRepository.updateById(orderId, { razorpayOrderId: rzpOrder.id });

    await paymentRepository.create({
      order: orderId,
      customer: customerId,
      amount: order.totalPrice,
      method: "online",
      razorpayOrderId: rzpOrder.id,
    });

    return rzpOrder;
  },

  verifyPayment: async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId }) => {
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) throw new Error("Payment verification failed");

    await orderRepository.updateById(orderId, {
      paymentStatus: "paid",
      razorpayPaymentId,
    });

    await paymentRepository.updateById(
      (await paymentRepository.findByOrder(orderId))._id,
      { status: "success", razorpayPaymentId, razorpaySignature }
    );

    return { verified: true };
  },
};

export default paymentService;
