import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Bell, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/atoms/Logo";
import CartItem from "@/components/molecules/CartItem";
import { useAuth } from "@/store/authStore";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: cart } = useCart();

  const cartCount = cart?.items?.length || 0;
  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/owner/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">Products</Link>
          {user && (
            <Link to="/orders" className="text-muted-foreground hover:text-foreground transition-colors">My Orders</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === "customer" && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center font-bold">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Your Cart ({cartCount})</SheetTitle>
                    </SheetHeader>
                    <div className="px-6 overflow-y-auto flex-1 mt-4">
                      {cart?.items?.length > 0 ? (
                        cart.items.map((item) => <CartItem key={item._id} item={item} />)
                      ) : (
                        <p className="text-center text-muted-foreground py-8">Cart is empty</p>
                      )}
                    </div>
                    {cart?.items?.length > 0 && (
                      <div className="p-6 border-t">
                        <div className="flex justify-between font-semibold mb-4">
                          <span>Total</span>
                          <span className="text-primary">{formatPrice(cart.totalPrice)}</span>
                        </div>
                        <Button className="w-full" onClick={() => navigate("/checkout")}>
                          Checkout
                        </Button>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              )}

              {(user.role === "admin" || user.role === "owner") && (
                <Button variant="ghost" size="icon" asChild>
                  <Link to={dashboardPath}>
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                </Button>
              )}

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 cursor-pointer" onClick={() => navigate("/profile")}>
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
              <Button asChild><Link to="/register">Register</Link></Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
