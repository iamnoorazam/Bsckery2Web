import authService from "../services/auth.service.js";
import sendResponse from "../utils/sendResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  sendResponse(res, 201, "Registration successful", result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  sendResponse(res, 200, "Login successful", result);
});

export const logout = (req, res) => {
  sendResponse(res, 200, "Logged out successfully");
};

export const forgotPassword = asyncHandler(async (req, res) => {
  const token = await authService.forgotPassword(req.body.email);
  sendResponse(res, 200, "Reset token generated", { resetToken: token });
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  sendResponse(res, 200, "Password reset successful");
});
