import Category from "../models/Category.js";

const categoryRepository = {
  findAll: () => Category.find().select("name image").lean().exec(),

  findById: (id) => Category.findById(id).lean().exec(),

  findByName: (name) => Category.findOne({ name }).lean().exec(),

  create: (data) => Category.create(data),

  updateById: (id, data) => Category.findByIdAndUpdate(id, data, { new: true }),

  deleteById: (id) => Category.findByIdAndDelete(id),
};

export default categoryRepository;
