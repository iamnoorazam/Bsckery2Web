import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/atoms/EmptyState";
import Spinner from "@/components/atoms/Spinner";
import { useOwnerOrders, useOwnerUpdateOrderStatus } from "@/hooks/useOwner";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";

const STATUS_OPTIONS = ["accepted", "preparing", "out_for_delivery", "delivered", "cancelled"];

const OwnerOrders = () => {
  const { data: orders, isLoading } = useOwnerOrders();
  const updateStatus = useOwnerUpdateOrderStatus();
  const { toast } = useToast();

  const handleStatusChange = (id, status) => {
    updateStatus.mutate({ id, status }, {
      onSuccess: () => toast({ title: "Status updated" }),
      onError: () => toast({ title: "Failed to update status", variant: "destructive" }),
    });
  };

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Orders ({orders?.length ?? 0})</h1>
      {!orders?.length ? (
        <EmptyState icon="📭" title="No orders yet" />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="font-medium mt-0.5">{order.customer?.name}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    <div className="mt-1 space-y-0.5">
                      {order.items?.map((item) => (
                        <p key={item._id} className="text-sm">{item.product?.name} × {item.quantity}</p>
                      ))}
                    </div>
                    <p className="font-bold text-primary mt-2">{formatPrice(order.totalPrice)}</p>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full text-center ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.replace(/_/g, " ")}
                    </span>
                    {order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && (
                      <Select onValueChange={(val) => handleStatusChange(order._id, val)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Update status" /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">{s.replace(/_/g, " ")}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerOrders;
