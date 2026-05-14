import User from "../models/User.js";

const userRepository = {
  findByEmail: (email) => User.findOne({ email }).lean().exec(),

  findById: (id) => User.findById(id).select("-password").lean().exec(),

  findByIdWithPassword: (id) => User.findById(id),

  findByResetToken: (hashedToken) =>
    User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }),

  create: (data) => User.create(data),

  updateById: (id, data) =>
    User.findByIdAndUpdate(id, data, { new: true }).select("-password"),

  deleteById: (id) => User.findByIdAndDelete(id),

  findAll: (filter = {}) => User.find(filter).select("-password").lean().exec(),
};

export default userRepository;
