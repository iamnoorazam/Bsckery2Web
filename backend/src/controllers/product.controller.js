import productService from "../services/product.service.js";
import sendResponse from "../utils/sendResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  sendResponse(res, 200, "Products fetched", result);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  sendResponse(res, 200, "Product fetched", product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct({
    body: req.body,
    files: req.files,
    ownerId: req.user._id,
  });
  sendResponse(res, 201, "Product created", product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct({
    id: req.params.id,
    body: req.body,
    files: req.files,
    user: req.user,
  });
  sendResponse(res, 200, "Product updated", product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct({ id: req.params.id, user: req.user });
  sendResponse(res, 200, "Product deleted");
});
