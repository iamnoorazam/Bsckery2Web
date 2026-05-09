import orderService from "../services/order.service.js";
import sendResponse from "../utils/sendResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const placeOrder = asyncHandler(async (req, res) => {
  const order = await orderService.placeOrder(req.user._id, req.body);
  sendResponse(res, 201, "Order placed", order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user._id);
  sendResponse(res, 200, "Orders fetched", orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  sendResponse(res, 200, "Order fetched", order);
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.user._id);
  sendResponse(res, 200, "Order cancelled", order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus({
    orderId: req.params.id,
    status: req.body.status,
    userId: req.user._id,
    role: req.user.role,
  });
  sendResponse(res, 200, "Order status updated", order);
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();
  sendResponse(res, 200, "All orders fetched", orders);
});
