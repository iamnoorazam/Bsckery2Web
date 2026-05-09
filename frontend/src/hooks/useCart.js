import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/api/cart.api";
import { useAuth } from "@/store/authStore";

export const useCart = () => {
  const { user, isLoggedIn } = useAuth();
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.get().then((r) => r.data.data),
    enabled: isLoggedIn && user?.role === "customer",
  });
};

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => cartApi.addItem(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId) => cartApi.removeItem(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useUpdateCartQuantity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }) => cartApi.updateQuantity(productId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useClearCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};
