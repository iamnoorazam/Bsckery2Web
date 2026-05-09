import adminService from "../services/admin.service.js";
import categoryService from "../services/category.service.js";
import sendResponse from "../utils/sendResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers(req.query.role);
  sendResponse(res, 200, "Users fetched", users);
});

export const blockUnblockUser = asyncHandler(async (req, res) => {
  const { isBlocked } = req.body;
  const user = await adminService.blockUnblockUser(req.params.id, isBlocked);
  sendResponse(res, 200, `User ${isBlocked ? "blocked" : "unblocked"}`, user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id);
  sendResponse(res, 200, "User deleted");
});

export const approveOwner = asyncHandler(async (req, res) => {
  const user = await adminService.approveOwner(req.params.id);
  sendResponse(res, 200, "Owner approved", user);
});

export const getPlatformStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getPlatformStats();
  sendResponse(res, 200, "Platform stats fetched", stats);
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body);
  sendResponse(res, 201, "Category created", category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  sendResponse(res, 200, "Category updated", category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.delete(req.params.id);
  sendResponse(res, 200, "Category deleted");
});
