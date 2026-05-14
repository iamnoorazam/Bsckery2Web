import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormField from "@/components/molecules/FormField";
import { useAuth } from "@/store/authStore";
import { useToast, TOAST_MESSAGES } from "@/store/Toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateLoginForm } from "@/utils/validation";

const Login = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (values) => {
    try {
      const user = await login(values);

      if (user.role !== "owner") {
        logout();
        showToast({
          ...TOAST_MESSAGES.ERROR.UNAUTHORIZED,
          description: "Please use the owner login page.",
        });
        return;
      }

      showToast(TOAST_MESSAGES.SUCCESS.LOGIN);
      navigate("/owner/dashboard");
    } catch (err) {
      const message = err.userMessage || err.response?.data?.message;
      showToast({
        title: "Login Failed",
        description: message || "Invalid email or password",
        type: "error",
      });
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
  } = useFormValidation(
    { email: "", password: "" },
    handleSubmit,
    validateLoginForm,
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">Owner Login</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in with your owner account
        </p>
      </div>

      <div>
        <FormField
          label="Email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="john@example.com"
          required
        />
        {touched.email && errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <FormField
          label="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="••••••••"
          required
        />
        {touched.password && errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-xs text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || Object.keys(errors).length > 0}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
      <Button type="button" variant="outline" className="w-full" asChild>
        <Link to="/">Return to Home</Link>
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-primary hover:underline font-medium"
        >
          Register
        </Link>
      </p>
    </form>
  );
};

export default Login;
