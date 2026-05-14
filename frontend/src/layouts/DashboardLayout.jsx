import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/atoms/Logo";
import { useAuth } from "@/store/authStore";

const ownerLinks = [
  { to: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/owner/products", label: "Products", icon: Package },
  { to: "/owner/orders", label: "Orders", icon: ShoppingBag },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/categories", label: "Categories", icon: Tag },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  const links = user?.role === "admin" ? adminLinks : ownerLinks;

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r bg-card flex flex-col py-4 fixed h-full">
        <div className="px-4 mb-6">
          <Logo />
        </div>
        <Separator className="mb-4" />
        <nav className="flex-1 px-3 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-accent"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 mt-auto">
          <Separator className="mb-3" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 ml-56 p-6 bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
