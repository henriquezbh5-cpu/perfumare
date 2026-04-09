import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-gold-500 to-gold-400 text-bark-50 hover:from-gold-400 hover:to-gold-300 active:from-gold-600 active:to-gold-500 shadow-[0_0_15px_rgba(212,168,83,0.2)]",
  secondary:
    "bg-cream-200/50 text-bark-400 border border-cream-400/30 hover:bg-cream-300/50 active:bg-cream-400/50 backdrop-blur-sm",
  ghost:
    "text-bark-300 hover:bg-cream-200/30 active:bg-cream-300/30",
  outline:
    "border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 active:bg-gold-500/20 hover:border-gold-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 rounded-md",
  md: "text-sm px-4 py-2 rounded-lg",
  lg: "text-base px-6 py-3 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:ring-offset-1 focus:ring-offset-cream-50 disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
