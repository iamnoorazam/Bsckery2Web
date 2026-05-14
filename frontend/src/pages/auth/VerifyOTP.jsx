import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormField from "@/components/molecules/FormField";
import { authApi } from "@/api/auth.api";
import { useToast } from "../../store/Toast";

const VerifyOTP = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("otp");
  const email = location.state?.email || "";

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.verifyOTP({ email, otp });
      localStorage.setItem("resetToken", response.data.data.resetToken);
      setStep("reset");
    } catch (err) {
      toast({ title: err.response?.data?.message || "Invalid OTP", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const resetToken = localStorage.getItem("resetToken");
      await authApi.resetPassword({ token: resetToken, password });
      localStorage.removeItem("resetToken");
      toast({ title: "Password reset successful", variant: "success" });
      navigate("/login");
    } catch (err) {
      toast({ title: err.response?.data?.message || "Error resetting password", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">Email not found. Please start again.</p>
        <Link to="/forgot-password" className="text-primary hover:underline">
          Go to forgot password
        </Link>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleOtpSubmit} className="space-y-4">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold">Verify OTP</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter the 6-digit OTP sent to {email}</p>
        </div>
        <FormField
          label="OTP"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
          required
          pattern="[0-9]{6}"
          title="Enter a 6-digit OTP"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
        <p className="text-sm text-center">
          <Link to="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-sm text-muted-foreground mt-1">Create a new password</p>
      </div>
      <FormField
        label="New Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        required
      />
      <FormField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
      <p className="text-sm text-center">
        <Link to="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
};

export default VerifyOTP;
