import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  charCount?: { current: number; max: number };
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, charCount, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-bark-400">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-lg border border-cream-400/30 bg-cream-200/30 px-3 py-2 text-sm text-bark-500 placeholder:text-cream-500 transition-all duration-200 resize-y min-h-[100px] backdrop-blur-sm",
            "focus:outline-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400/50 focus:bg-cream-200/50",
            error && "border-red-400/50 focus:ring-red-400/40 focus:border-red-400/50",
            className
          )}
          {...props}
        />
        <div className="flex justify-between">
          {error && <p className="text-xs text-red-500">{error}</p>}
          {charCount && (
            <p
              className={cn(
                "text-xs ml-auto",
                charCount.current > charCount.max ? "text-red-500" : "text-cream-600"
              )}
            >
              {charCount.current}/{charCount.max}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
