import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = ({
    title,
    description = "",
    type = "success",
    duration = 3000,
  }) => {
    setToast({
      title,
      description,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          className={`
            fixed top-5 right-5 z-50
            min-w-[320px]
            rounded-xl
            px-5 py-4
            shadow-2xl
            text-white
            animate-in slide-in-from-right
            ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                  ? "bg-red-500"
                  : "bg-blue-500"
            }
          `}
        >
          <h3 className="font-semibold text-sm">{toast.title}</h3>

          {toast.description && (
            <p className="text-sm opacity-90 mt-1">{toast.description}</p>
          )}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
