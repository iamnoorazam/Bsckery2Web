import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import OrderCard from "@/components/molecules/OrderCard";
import EmptyState from "@/components/atoms/EmptyState";
import Spinner from "@/components/atoms/Spinner";
import { useMyOrders, useCancelOrder } from "@/hooks/useOrders";
import { useToast } from "../store/Toast";

const Orders = () => {
  const { data: orders, isLoading } = useMyOrders();
  const cancelOrder = useCancelOrder();
  const { toast } = useToast();

  const handleCancel = (id) => {
    cancelOrder.mutate(id, {
      onSuccess: () => toast({ title: "Order cancelled" }),
      onError: (err) =>
        toast({
          title: err.response?.data?.message || "Cannot cancel order",
          variant: "destructive",
        }),
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {!orders?.length ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="Place your first order today!"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id}>
              <OrderCard order={order} />
              {order.orderStatus === "placed" && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleCancel(order._id)}
                  disabled={cancelOrder.isLoading}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
