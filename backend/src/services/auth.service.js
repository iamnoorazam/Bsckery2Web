import bcrypt from "bcryptjs";
import crypto from "crypto";
import userRepository from "../repositories/user.repository.js";
import generateToken from "../utils/generateToken.js";
import emailService from "./email.service.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const authService = {
  register: async ({ name, email, password, role }) => {
    const existing = await userRepository.findByEmail(email);

    if (existing) {
      throw createError("Email already registered", 409);
    }

    if (role !== "owner") {
      throw createError("Only owner registration is allowed", 403);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name,
      email,
      password: hashed,
      role,
    });

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  login: async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw createError("Invalid credentials", 401);
    }

    if (user.isBlocked) {
      throw createError("Account blocked", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createError("Invalid credentials", 401);
    }

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  forgotPassword: async (email) => {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw createError("No user found with this email", 404);
    }

    if (user.otpBlockedUntil && new Date(user.otpBlockedUntil) > new Date()) {
      throw createError("Too many failed attempts. Try again later.", 429);
    }

    const otp = emailService.generateOTP();
    await emailService.sendOTP(email, otp);

    await userRepository.updateById(user._id, {
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
      otpAttempts: 0,
      otpBlockedUntil: null,
    });

    return { email };
  },

  verifyOTP: async ({ email, otp }) => {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw createError("No user found with this email", 404);
    }

    if (user.otpBlockedUntil && new Date(user.otpBlockedUntil) > new Date()) {
      throw createError("Too many failed attempts. Try again later.", 429);
    }

    if (!user.otp || !user.otpExpire || new Date(user.otpExpire) < new Date()) {
      throw createError("OTP expired. Please request a new one.", 400);
    }

    if (user.otp !== otp) {
      const attempts = (user.otpAttempts || 0) + 1;
      const shouldBlock = attempts >= 5;
      await userRepository.updateById(user._id, {
        otpAttempts: attempts,
        otpBlockedUntil: shouldBlock ? Date.now() + 15 * 60 * 1000 : null,
      });
      throw createError("Invalid OTP", 400);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await userRepository.updateById(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: Date.now() + 15 * 60 * 1000,
      otp: null,
      otpExpire: null,
      otpAttempts: 0,
      otpBlockedUntil: null,
    });

    return { resetToken: rawToken };
  },

  resetPassword: async ({ token, password }) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userRepository.findByResetToken(hashedToken);

    if (!user) {
      throw createError("Invalid or expired reset token", 400);
    }

    const hashed = await bcrypt.hash(password, 10);

    await userRepository.updateById(user._id, {
      password: hashed,
      resetPasswordToken: undefined,
      resetPasswordExpire: undefined,
    });
  },
};

export default authService;
