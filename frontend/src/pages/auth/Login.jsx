import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormField from "@/components/molecules/FormField";
import { useAuth } from "@/store/authStore";
import { useToast } from "../../store/Toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      const redirect = user.role === "admin" ? "/admin/dashboard" : user.role === "owner" ? "/owner/dashboard" : "/";
      navigate(redirect);
    } catch (err) {
      toast({ title: err.response?.data?.message || "Login failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Login to your account</p>
      </div>
      <FormField label="Email" type="email" value={form.email} onChange={set("email")} placeholder="john@example.com" required />
      <FormField label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" required />
      <div className="text-right">
        <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary hover:underline font-medium">Register</Link>
      </p>
    </form>
  );
};

export default Login;
