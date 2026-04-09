import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-bark-400"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border border-cream-400/30 bg-cream-200/30 px-3 py-2 text-sm text-bark-500 placeholder:text-cream-500 transition-all duration-200 backdrop-blur-sm",
            "focus:outline-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400/50 focus:bg-cream-200/50",
            error && "border-red-400/50 focus:ring-red-400/40 focus:border-red-400/50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
