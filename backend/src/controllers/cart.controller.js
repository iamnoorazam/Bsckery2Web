import cartService from "../services/cart.service.js";
import sendResponse from "../utils/sendResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  sendResponse(res, 200, "Cart fetched", cart);
});

export const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user._id, req.body);
  sendResponse(res, 200, "Item added to cart", cart);
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user._id, req.params.productId);
  sendResponse(res, 200, "Item removed from cart", cart);
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const cart = await cartService.updateQuantity(
    req.user._id,
    req.params.productId,
    req.body.quantity
  );
  sendResponse(res, 200, "Quantity updated", cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user._id);
  sendResponse(res, 200, "Cart cleared");
});
