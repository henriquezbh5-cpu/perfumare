import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "gold" | "arabian";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-gold-500/10 border border-gold-500/20 text-gold-500 backdrop-blur-sm",
  gold:
    "bg-gradient-to-r from-gold-500 to-gold-400 text-cream-50 border border-gold-400/30",
  arabian:
    "bg-cream-200/30 text-gold-400 border border-cream-300/20 backdrop-blur-sm",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-chip px-3 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
