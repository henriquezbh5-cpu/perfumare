"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg";
}

const maxWidthStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = "md",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className={cn(
          "relative w-full bg-cream-100/95 backdrop-blur-xl rounded-xl shadow-card-hover border border-cream-300/30 animate-in zoom-in-95 duration-200",
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300/20">
            <h3 className="font-serif text-lg text-bark-500">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-bark-200 hover:text-bark-400 hover:bg-cream-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-md text-bark-200 hover:text-bark-400 hover:bg-cream-100 transition-colors z-10"
          >
            <X size={18} />
          </button>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
