import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CartItem from "@/components/molecules/CartItem";
import EmptyState from "@/components/atoms/EmptyState";
import Spinner from "@/components/atoms/Spinner";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

const Cart = () => {
  const { data: cart, isLoading } = useCart();

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  if (!cart?.items?.length) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <EmptyState icon="🛒" title="Your cart is empty" description="Browse our products and add something delicious!" />
        <div className="flex justify-center mt-6">
          <Button asChild><Link to="/products">Shop Now</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="bg-card border rounded-lg p-4">
        {cart.items.map((item) => (
          <CartItem key={item._id || item.product?._id} item={item} />
        ))}
      </div>
      <div className="mt-4 bg-card border rounded-lg p-4 space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal ({cart.items.length} items)</span>
          <span>{formatPrice(cart.totalPrice)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">{formatPrice(cart.totalPrice)}</span>
        </div>
        <Button className="w-full" size="lg" asChild>
          <Link to="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  );
};

export default Cart;
