import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/authStore";

const ProtectedRoute = ({ children, roles }) => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;