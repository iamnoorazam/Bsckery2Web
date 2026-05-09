import categoryRepository from "../repositories/category.repository.js";

const categoryService = {
  getAll: () => categoryRepository.findAll(),

  create: async (data) => {
    const existing = await categoryRepository.findByName(data.name);
    if (existing) throw new Error("Category already exists");
    return categoryRepository.create(data);
  },

  update: async (id, data) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw new Error("Category not found");
    return categoryRepository.updateById(id, data);
  },

  delete: async (id) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw new Error("Category not found");
    return categoryRepository.deleteById(id);
  },
};

export default categoryService;
