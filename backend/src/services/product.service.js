import productRepository from "../repositories/product.repository.js";
import cloudinary from "../config/cloudinary.js";

const productService = {
  getAllProducts: async ({ category, search, page = 1, limit = 12 }) => {
    const filter = { isAvailable: true };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      productRepository.findAll(filter, skip, Number(limit)),
      productRepository.count(filter),
    ]);

    return { products, total, page: Number(page) };
  },

  getProductById: async (id) => {
    const product = await productRepository.findById(id);
    if (!product) throw new Error("Product not found");
    return product;
  },

  createProduct: async ({ body, files, ownerId }) => {
    const { name, description, price, category, stock } = body;

    if (!name || !description || !price || !category) {
      throw Object.assign(new Error("name, description, price and category are required"), { statusCode: 400 });
    }
    if (!category.match(/^[a-f\d]{24}$/i)) {
      throw Object.assign(new Error("Invalid category selected"), { statusCode: 400 });
    }

    const images = files ? files.map((f) => f.path) : [];

    return productRepository.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock) || 0,
      owner: ownerId,
      images,
    });
  },

  updateProduct: async ({ id, body, files, user }) => {
    const product = await productRepository.findById(id);
    if (!product) throw new Error("Product not found");

    const isOwner = product.owner._id.toString() === user._id.toString();
    if (!isOwner && user.role !== "admin") throw new Error("Not authorized");

    const updates = {};
    if (body.name) updates.name = body.name;
    if (body.description) updates.description = body.description;
    if (body.price) updates.price = Number(body.price);
    if (body.stock !== undefined) updates.stock = Number(body.stock);
    if (body.category) updates.category = body.category;
    if (body.isAvailable !== undefined) updates.isAvailable = body.isAvailable;
    if (files && files.length > 0) updates.images = files.map((f) => f.path);

    return productRepository.updateById(id, updates);
  },

  deleteProduct: async ({ id, user }) => {
    const product = await productRepository.findById(id);
    if (!product) throw new Error("Product not found");

    const isOwner = product.owner._id.toString() === user._id.toString();
    if (!isOwner && user.role !== "admin") throw new Error("Not authorized");

    for (const imgUrl of product.images) {
      const publicId = imgUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`bakery/products/${publicId}`);
    }

    await productRepository.deleteById(id);
  },
};

export default productService;
