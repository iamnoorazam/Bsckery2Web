import Review from "../models/Review.js";

const reviewRepository = {
  findByProduct: (productId) =>
    Review.find({ product: productId }).populate("customer", "name avatar"),

  findByProductAndCustomer: (productId, customerId) =>
    Review.findOne({ product: productId, customer: customerId }),

  findById: (id) => Review.findById(id),

  create: (data) => Review.create(data),

  updateById: (id, data) => Review.findByIdAndUpdate(id, data, { new: true }),

  deleteById: (id) => Review.findByIdAndDelete(id),

  averageRating: (productId) =>
    Review.aggregate([
      { $match: { product: productId } },
      { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]),
};

export default reviewRepository;
