import ownerService from "../services/owner.service.js";
import sendResponse from "../utils/sendResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await ownerService.getDashboard(req.user._id);
  sendResponse(res, 200, "Dashboard fetched", stats);
});

export const getOwnerOrders = asyncHandler(async (req, res) => {
  const orders = await ownerService.getOwnerOrders(req.user._id);
  sendResponse(res, 200, "Orders fetched", orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await ownerService.updateOrderStatus(
    req.params.id,
    req.user._id,
    req.body.status
  );
  sendResponse(res, 200, "Order status updated", order);
});

export const getOwnerProducts = asyncHandler(async (req, res) => {
  const products = await ownerService.getOwnerProducts(req.user._id);
  sendResponse(res, 200, "Products fetched", products);
});
