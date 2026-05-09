import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendResponse from "../utils/sendResponse.js";

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return sendResponse(res, 401, "Not authorized, token missing");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return sendResponse(res, 401, "User not found");
    if (user.isBlocked) return sendResponse(res, 403, "Your account has been blocked");

    req.user = user;
    next();
  } catch {
    return sendResponse(res, 401, "Invalid or expired token");
  }
};

export default protect;
