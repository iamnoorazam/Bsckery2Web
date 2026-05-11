import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FormField from "@/components/molecules/FormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { usePlaceOrder } from "@/hooks/useOrders";
import { useToast } from "../store/Toast";
import { formatPrice } from "@/lib/utils";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: cart } = useCart();
  const placeOrder = usePlaceOrder();

  const [form, setForm] = useState({ street: "", city: "", state: "", pincode: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder.mutate(
      { deliveryAddress: form, paymentMethod },
      {
        onSuccess: () => {
          toast({ title: "Order placed successfully!" });
          navigate("/orders");
        },
        onError: (err) => toast({ title: err.response?.data?.message || "Failed to place order", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold">Delivery Address</h2>
          <FormField label="Street" value={form.street} onChange={set("street")} placeholder="123 Main St" required />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="City" value={form.city} onChange={set("city")} placeholder="Mumbai" required />
            <FormField label="State" value={form.state} onChange={set("state")} placeholder="Maharashtra" required />
          </div>
          <FormField label="Pincode" value={form.pincode} onChange={set("pincode")} placeholder="400001" required />
        </div>

        <div className="bg-card border rounded-lg p-4 space-y-3">
          <h2 className="font-semibold">Payment Method</h2>
          <div className="space-y-1.5">
            <Label>Select method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 space-y-2">
          <h2 className="font-semibold">Order Summary</h2>
          {cart?.items?.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span>{item.product?.name} × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">{formatPrice(cart?.totalPrice || 0)}</span>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={placeOrder.isPending}>
          {placeOrder.isPending ? "Placing Order..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
};

export default Checkout;
