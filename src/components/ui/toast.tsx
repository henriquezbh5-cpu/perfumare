"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = type === "success" ? CheckCircle : XCircle;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-card-hover border transition-all duration-200",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        type === "success"
          ? "bg-cream-100/95 backdrop-blur-xl border-green-500/30 text-green-400"
          : "bg-cream-100/95 backdrop-blur-xl border-red-500/30 text-red-400"
      )}
    >
      <Icon size={18} />
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="p-0.5 hover:opacity-70">
        <X size={14} />
      </button>
    </div>
  );
}
