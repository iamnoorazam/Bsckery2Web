import paymentService from "../services/payment.service.js";
import sendResponse from "../utils/sendResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const rzpOrder = await paymentService.createRazorpayOrder(
    req.params.orderId,
    req.user._id
  );
  sendResponse(res, 200, "Razorpay order created", rzpOrder);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.verifyPayment(req.body);
  sendResponse(res, 200, "Payment verified", result);
});
