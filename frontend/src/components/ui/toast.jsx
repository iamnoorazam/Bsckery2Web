import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = ({ className, ...props }) => (
  <ToastPrimitive.Viewport
    className={cn("fixed top-0 right-0 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2 p-4", className)}
    {...props}
  />
);

const Toast = ({ className, variant = "default", ...props }) => (
  <ToastPrimitive.Root
    className={cn(
      "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg animate-slide-in-right",
      variant === "destructive" && "border-destructive bg-destructive text-destructive-foreground",
      variant === "default" && "border bg-background text-foreground",
      className
    )}
    {...props}
  />
);

const ToastTitle = ({ className, ...props }) => (
  <ToastPrimitive.Title className={cn("text-sm font-semibold", className)} {...props} />
);
const ToastDescription = ({ className, ...props }) => (
  <ToastPrimitive.Description className={cn("text-sm opacity-90", className)} {...props} />
);
const ToastClose = ({ className, ...props }) => (
  <ToastPrimitive.Close
    className={cn("absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100", className)}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
);
const ToastAction = ToastPrimitive.Action;

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction };
