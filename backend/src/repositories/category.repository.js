import Category from "../models/Category.js";

const categoryRepository = {
  findAll: () => Category.find(),

  findById: (id) => Category.findById(id),

  findByName: (name) => Category.findOne({ name }),

  create: (data) => Category.create(data),

  updateById: (id, data) => Category.findByIdAndUpdate(id, data, { new: true }),

  deleteById: (id) => Category.findByIdAndDelete(id),
};

export default categoryRepository;
