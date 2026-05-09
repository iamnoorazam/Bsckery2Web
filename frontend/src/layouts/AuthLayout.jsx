import { Outlet, Link } from "react-router-dom";
import Logo from "@/components/atoms/Logo";

const AuthLayout = () => (
  <div className="min-h-screen flex items-center justify-center bg-secondary/20 p-4">
    <div className="w-full max-w-md animate-slide-up">
      <div className="flex justify-center mb-6">
        <Logo />
      </div>
      <div className="bg-card border rounded-lg shadow-sm p-6">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
