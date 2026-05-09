import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/api/order.api";

export const useMyOrders = () =>
  useQuery({
    queryKey: ["my-orders"],
    queryFn: () => orderApi.getMyOrders().then((r) => r.data.data),
  });

export const useOrder = (id) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });

export const useAllOrders = () =>
  useQuery({
    queryKey: ["all-orders"],
    queryFn: () => orderApi.getAll().then((r) => r.data.data),
  });

export const usePlaceOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => orderApi.place(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => orderApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-orders"] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => orderApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-orders"] });
      qc.invalidateQueries({ queryKey: ["owner-orders"] });
    },
  });
};
