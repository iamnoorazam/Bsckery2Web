import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";

const OrderCard = ({ order }) => (
  <Card className="animate-fade-in">
    <CardContent className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground font-mono">#{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus.replace(/_/g, " ")}
        </span>
      </div>
      <div className="mt-3 space-y-1">
        {order.items?.map((item) => (
          <p key={item._id} className="text-sm">
            {item.product?.name} × {item.quantity}
          </p>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <span className="text-sm text-muted-foreground">{order.paymentMethod?.toUpperCase()}</span>
        <span className="font-bold text-primary">{formatPrice(order.totalPrice)}</span>
      </div>
    </CardContent>
  </Card>
);

export default OrderCard;
