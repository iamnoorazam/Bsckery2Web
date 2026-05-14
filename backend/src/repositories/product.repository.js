import Product from "../models/Product.js";

const productRepository = {
  findAll: (filter = {}, skip = 0, limit = 12) =>
    Product.find(filter)
      .populate("category", "name")
      .populate("owner", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean() // Faster for read-only operations
      .exec(),

  count: (filter = {}) => Product.countDocuments(filter),

  findById: (id) =>
    Product.findById(id)
      .populate("category", "name")
      .populate("owner", "name")
      .lean()
      .exec(),

  findByOwner: (ownerId, skip = 0, limit = 12) =>
    Product.find({ owner: ownerId })
      .select("name price stock images category isAvailable")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),

  create: (data) => Product.create(data),

  updateById: (id, data) =>
    Product.findByIdAndUpdate(id, data, { new: true })
      .populate("category", "name")
      .populate("owner", "name"),

  deleteById: (id) => Product.findByIdAndDelete(id),
};

export default productRepository;
