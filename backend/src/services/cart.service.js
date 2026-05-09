import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";

const recalcTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const cartService = {
  getCart: async (userId) => {
    const cart = await cartRepository.findByUser(userId);
    return cart || { items: [], totalPrice: 0 };
  },

  addItem: async (userId, { productId, quantity = 1 }) => {
    const product = await productRepository.findById(productId);
    if (!product) throw new Error("Product not found");
    if (!product.isAvailable) throw new Error("Product is not available");

    let cart = await cartRepository.findByUser(userId);
    const items = cart ? [...cart.items] : [];

    const existingIndex = items.findIndex(
      (i) => i.product._id.toString() === productId
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({ product: productId, quantity, price: product.price });
    }

    const totalPrice = recalcTotal(items);
    return cartRepository.upsert(userId, { items, totalPrice });
  },

  removeItem: async (userId, productId) => {
    const cart = await cartRepository.findByUser(userId);
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter(
      (i) => i.product._id.toString() !== productId
    );
    cart.totalPrice = recalcTotal(cart.items);
    return cart.save();
  },

  updateQuantity: async (userId, productId, quantity) => {
    if (quantity < 1) throw new Error("Quantity must be at least 1");

    const cart = await cartRepository.findByUser(userId);
    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find((i) => i.product._id.toString() === productId);
    if (!item) throw new Error("Item not in cart");

    item.quantity = quantity;
    cart.totalPrice = recalcTotal(cart.items);
    return cart.save();
  },

  clearCart: (userId) => cartRepository.deleteByUser(userId),
};

export default cartService;
