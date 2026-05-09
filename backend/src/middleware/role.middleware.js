import sendResponse from "../utils/sendResponse.js";

const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return sendResponse(res, 403, "Access denied: insufficient permissions");
  }
  next();
};

export default allowRoles;
