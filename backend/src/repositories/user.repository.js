import User from "../models/User.js";

const userRepository = {
  findByEmail: (email) => User.findOne({ email }),

  findById: (id) => User.findById(id).select("-password"),

  findByIdWithPassword: (id) => User.findById(id),

  findByResetToken: (hashedToken) =>
    User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }),

  create: (data) => User.create(data),

  updateById: (id, data) => User.findByIdAndUpdate(id, data, { new: true }).select("-password"),

  deleteById: (id) => User.findByIdAndDelete(id),

  findAll: (filter = {}) => User.find(filter).select("-password"),
};

export default userRepository;
