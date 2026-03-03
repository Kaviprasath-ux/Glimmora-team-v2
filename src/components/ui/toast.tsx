"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles: Record<ToastType, string> = {
  success: "border-success/20",
  error: "border-error/20",
  warning: "border-warning/20",
  info: "border-info/20",
};

const iconStyles: Record<ToastType, string> = {
  success: "text-success",
  error: "text-error",
  warning: "text-warning",
  info: "text-info",
};

// Simple toast store
let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

function notify(toast: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  toasts = [...toasts, { ...toast, id }];
  toastListeners.forEach((l) => l(toasts));
  setTimeout(() => {
    dismiss(id);
  }, 4000);
}

function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  toastListeners.forEach((l) => l(toasts));
}

function useToasts() {
  const [state, setState] = React.useState<Toast[]>([]);
  React.useEffect(() => {
    toastListeners.push(setState);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setState);
    };
  }, []);
  return state;
}

function ToastContainer() {
  const items = useToasts();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {items.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-start gap-3 rounded-[var(--radius-md)] border p-4 shadow-warm-md bg-[#FBF8F4]",
                toastStyles[toast.type],
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconStyles[toast.type])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-deep">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="shrink-0 rounded p-0.5 text-text-muted hover:text-text-deep transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export { ToastContainer, notify, dismiss };
export type { Toast, ToastType };
