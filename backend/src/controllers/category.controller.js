import categoryService from "../services/category.service.js";
import sendResponse from "../utils/sendResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAll();
  sendResponse(res, 200, "Categories fetched", categories);
});
