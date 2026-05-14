import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormField from "@/components/molecules/FormField";
import { useAuth } from "@/store/authStore";
import { useToast } from "../../store/Toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(form);

      if (user.role !== "admin") {
        logout();
        toast({
          title: "Access denied",
          description: "This page is for admin users only.",
          variant: "destructive",
        });
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      toast({
        title: err.response?.data?.message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Use the seeded admin credentials.
        </p>
      </div>
      <FormField
        label="Email"
        type="email"
        value={form.email}
        onChange={set("email")}
        placeholder="admin@bakery.com"
        required
      />
      <FormField
        label="Password"
        type="password"
        value={form.password}
        onChange={set("password")}
        placeholder="••••••••"
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Login as Admin"}
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        Back to{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          user login
        </Link>
        .
      </p>
    </form>
  );
};

export default AdminLogin;
