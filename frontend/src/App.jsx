import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/store/authStore";
import { ToastProvider } from "@/store/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";

import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/layouts/ProtectedRoute";

import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";

import Login from "@/pages/auth/Login";
import AdminLogin from "@/pages/auth/AdminLogin";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import VerifyOTP from "@/pages/auth/VerifyOTP";

import OwnerDashboard from "@/pages/owner/OwnerDashboard";
import OwnerProducts from "@/pages/owner/OwnerProducts";
import OwnerOrders from "@/pages/owner/OwnerOrders";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminCategories from "@/pages/admin/AdminCategories";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>

              {/* Auth */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
              </Route>

              {/* Customer */}
              <Route element={<MainLayout />}>
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute roles={["customer"]}>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Owner */}
              <Route
                element={
                  <ProtectedRoute roles={["owner"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />

                <Route path="/owner/products" element={<OwnerProducts />} />

                <Route path="/owner/orders" element={<OwnerOrders />} />
              </Route>

              {/* Admin */}
              <Route
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                <Route path="/admin/users" element={<AdminUsers />} />

                <Route path="/admin/categories" element={<AdminCategories />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
