import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useRemoveFromCart, useUpdateCartQuantity } from "@/hooks/useCart";

const CartItem = ({ item }) => {
  const remove = useRemoveFromCart();
  const updateQty = useUpdateCartQuantity();

  return (
    <div className="flex gap-3 py-4 border-b last:border-0 animate-fade-in">
      <img
        src={item.product?.images?.[0] || "https://placehold.co/80x80?text=Item"}
        alt={item.product?.name}
        className="w-16 h-16 rounded-md object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.product?.name}</p>
        <p className="text-primary font-semibold text-sm mt-1">{formatPrice(item.price)}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7"
            onClick={() => updateQty.mutate({ productId: item.product._id, quantity: item.quantity - 1 })}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7"
            onClick={() => updateQty.mutate({ productId: item.product._id, quantity: item.quantity + 1 })}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-destructive hover:text-destructive ml-auto"
            onClick={() => remove.mutate(item.product._id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
