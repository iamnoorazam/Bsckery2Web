import Payment from "../models/Payment.js";

const paymentRepository = {
  create: (data) => Payment.create(data),

  findByOrder: (orderId) => Payment.findOne({ order: orderId }),

  findById: (id) => Payment.findById(id),

  updateById: (id, data) => Payment.findByIdAndUpdate(id, data, { new: true }),

  findAll: () => Payment.find().populate("customer", "name email").sort({ createdAt: -1 }),
};

export default paymentRepository;
