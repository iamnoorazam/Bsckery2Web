import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormField from "@/components/molecules/FormField";
import { authApi } from "@/api/auth.api";
import { useToast } from "../../store/Toast";

const ForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      toast({ title: err.response?.data?.message || "Error sending OTP", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter your email to receive OTP</p>
      </div>
      <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </Button>
      <p className="text-sm text-center">
        <Link to="/login" className="text-primary hover:underline">Back to login</Link>
      </p>
    </form>
  );
};

export default ForgotPassword;
