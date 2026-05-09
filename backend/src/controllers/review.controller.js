import reviewService from "../services/review.service.js";
import sendResponse from "../utils/sendResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getProductReviews(req.params.productId);
  sendResponse(res, 200, "Reviews fetched", reviews);
});

export const addReview = asyncHandler(async (req, res) => {
  const review = await reviewService.addReview(
    req.user._id,
    req.params.productId,
    req.body
  );
  sendResponse(res, 201, "Review added", review);
});

export const editReview = asyncHandler(async (req, res) => {
  const review = await reviewService.editReview(
    req.params.id,
    req.user._id,
    req.body
  );
  sendResponse(res, 200, "Review updated", review);
});

export const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user);
  sendResponse(res, 200, "Review deleted");
});
