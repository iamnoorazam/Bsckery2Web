import bcrypt from "bcryptjs";
import crypto from "crypto";
import userRepository from "../repositories/user.repository.js";
import generateToken from "../utils/generateToken.js";

const authService = {
  register: async ({ name, email, password, role }) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password: hashed, role });

    const token = generateToken(user._id, user.role);
    return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
  },

  login: async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");
    if (user.isBlocked) throw new Error("Account blocked");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user._id, user.role);
    return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
  },

  forgotPassword: async (email) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("No user found with this email");

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await userRepository.updateById(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: Date.now() + 15 * 60 * 1000,
    });

    // TODO: send rawToken via email to user
    return rawToken;
  },

  resetPassword: async ({ token, password }) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userRepository.findByResetToken(hashedToken);
    if (!user) throw new Error("Invalid or expired reset token");

    const hashed = await bcrypt.hash(password, 10);
    await userRepository.updateById(user._id, {
      password: hashed,
      resetPasswordToken: undefined,
      resetPasswordExpire: undefined,
    });
  },
};

export default authService;
