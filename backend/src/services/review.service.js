import reviewRepository from "../repositories/review.repository.js";
import productRepository from "../repositories/product.repository.js";
import mongoose from "mongoose";

const updateProductRating = async (productId) => {
  const result = await reviewRepository.averageRating(
    new mongoose.Types.ObjectId(productId)
  );

  if (result.length > 0) {
    await productRepository.updateById(productId, {
      averageRating: result[0].avgRating.toFixed(1),
      totalReviews: result[0].count,
    });
  } else {
    await productRepository.updateById(productId, { averageRating: 0, totalReviews: 0 });
  }
};

const reviewService = {
  getProductReviews: (productId) => reviewRepository.findByProduct(productId),

  addReview: async (customerId, productId, { rating, comment }) => {
    const existing = await reviewRepository.findByProductAndCustomer(productId, customerId);
    if (existing) throw new Error("You have already reviewed this product");

    const review = await reviewRepository.create({
      product: productId,
      customer: customerId,
      rating,
      comment,
    });

    await updateProductRating(productId);
    return review;
  },

  editReview: async (reviewId, customerId, { rating, comment }) => {
    const review = await reviewRepository.findById(reviewId);
    if (!review) throw new Error("Review not found");
    if (review.customer.toString() !== customerId.toString()) {
      throw new Error("Not authorized");
    }

    const updated = await reviewRepository.updateById(reviewId, { rating, comment });
    await updateProductRating(review.product.toString());
    return updated;
  },

  deleteReview: async (reviewId, user) => {
    const review = await reviewRepository.findById(reviewId);
    if (!review) throw new Error("Review not found");

    const isOwner = review.customer.toString() === user._id.toString();
    if (!isOwner && user.role !== "admin") throw new Error("Not authorized");

    await reviewRepository.deleteById(reviewId);
    await updateProductRating(review.product.toString());
  },
};

export default reviewService;
