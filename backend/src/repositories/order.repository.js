import Order from "../models/Order.js";

const orderRepository = {
  create: (data) => Order.create(data),

  findById: (id) =>
    Order.findById(id)
      .populate("customer", "name email")
      .populate("owner", "name email")
      .populate("items.product", "name price"),

  findByCustomer: (customerId) =>
    Order.find({ customer: customerId })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 }),

  findByOwner: (ownerId) =>
    Order.find({ owner: ownerId })
      .populate("customer", "name email phone")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 }),

  findAll: () =>
    Order.find()
      .populate("customer", "name email")
      .populate("owner", "name email")
      .sort({ createdAt: -1 }),

  updateById: (id, data) => Order.findByIdAndUpdate(id, data, { new: true }),
};

export default orderRepository;
