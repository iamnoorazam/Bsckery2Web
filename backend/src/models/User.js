import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "owner", "customer"], default: "customer" },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    addresses: [addressSchema],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // OTP fields for password reset
    otp: String,
    otpExpire: Date,
    otpAttempts: { type: Number, default: 0 },
    otpBlockedUntil: Date
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
