import Product from "../models/Product.js";

const productRepository = {
  findAll: (filter = {}, skip = 0, limit = 12) =>
    Product.find(filter)
      .populate("category", "name")
      .populate("owner", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

  count: (filter = {}) => Product.countDocuments(filter),

  findById: (id) =>
    Product.findById(id).populate("category", "name").populate("owner", "name"),

  create: (data) => Product.create(data),

  updateById: (id, data) => Product.findByIdAndUpdate(id, data, { new: true }),

  deleteById: (id) => Product.findByIdAndDelete(id),
};

export default productRepository;
