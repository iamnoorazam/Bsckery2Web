import Cart from "../models/Cart.js";

const cartRepository = {
  findByUser: (userId) =>
    Cart.findOne({ user: userId }).populate("items.product", "name price images"),

  upsert: (userId, data) =>
    Cart.findOneAndUpdate({ user: userId }, data, { new: true, upsert: true }),

  deleteByUser: (userId) => Cart.findOneAndDelete({ user: userId }),
};

export default cartRepository;
