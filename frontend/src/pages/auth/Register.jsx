import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FormField from "@/components/molecules/FormField";
import { useAuth } from "@/store/authStore";
import { useToast } from "../../store/Toast";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await register({ ...form, role: "owner" });
      showToast({
        title: "Registration Successful",
        description: "Welcome to BakeryCo 🎉",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      showToast({
        title: "Registration Failed",
        description:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">Create Owner Account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Register as a bakery owner to manage products.
        </p>
      </div>
      <FormField
        label="Full Name"
        value={form.name}
        onChange={set("name")}
        placeholder="John Doe"
        required
      />
      <FormField
        label="Email"
        type="email"
        value={form.email}
        onChange={set("email")}
        placeholder="john@example.com"
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
      <div className="space-y-1.5">
        <Label>Account type</Label>
        <p className="text-sm text-muted-foreground">
          Owner account (only owner signup is supported)
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Owner Account"}
      </Button>
      <Button type="button" variant="outline" className="w-full" asChild>
        <Link to="/">Return to Home</Link>
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Login
        </Link>
      </p>
    </form>
  );
};

export default Register;
