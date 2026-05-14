import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

export default {
  generateOTP,
  sendOTP
};