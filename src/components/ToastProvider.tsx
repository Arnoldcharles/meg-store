"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { uniqueId } from "@/lib/uid";
import { motion, AnimatePresence } from "framer-motion";

type Toast = {
  id: string;
  message: string;
  type?: "info" | "success" | "error";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  } | null;
};

interface ToastContextType {
  addToast: (
    message: string,
    type?: Toast["type"],
    duration?: number,
    action?: Toast["action"]
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      message: string,
      type: Toast["type"] = "info",
      duration = 6000,
      action: Toast["action"] = null
    ) => {
      const id = uniqueId("t");
      const t: Toast = { id, message, type, duration, action };
      setToasts((s) => [t, ...s]);
      setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== id));
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              className={`pointer-events-auto max-w-sm px-4 py-3 rounded-lg shadow-lg text-white ${
                t.type === "success"
                  ? "bg-green-600"
                  : t.type === "error"
                  ? "bg-red-600"
                  : "bg-gray-800"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 pr-2">{t.message}</div>
                {t.action && (
                  <button
                    onClick={() => {
                      try {
                        t.action?.onClick();
                      } catch (e) {}
                      // remove this toast
                      setToasts((s) => s.filter((x) => x.id !== t.id));
                    }}
                    className="ml-2 text-sm font-semibold underline"
                  >
                    {t.action.label}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export default ToastProvider;
