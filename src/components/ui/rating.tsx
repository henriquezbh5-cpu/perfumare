import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

type RatingSize = "sm" | "md" | "lg";

interface RatingProps {
  value: number;
  max?: number;
  size?: RatingSize;
  showValue?: boolean;
  count?: number;
  className?: string;
}

const sizeMap: Record<RatingSize, { icon: number; text: string }> = {
  sm: { icon: 12, text: "text-xs" },
  md: { icon: 16, text: "text-sm" },
  lg: { icon: 20, text: "text-base" },
};

export function Rating({
  value,
  max = 5,
  size = "md",
  showValue = false,
  count,
  className,
}: RatingProps) {
  const { icon, text } = sizeMap[size];
  const clampedValue = Math.min(Math.max(value, 0), max);

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`Rating: ${clampedValue.toFixed(1)} out of ${max}`}
    >
      <div className="flex" aria-hidden="true">
        {Array.from({ length: max }, (_, i) => {
          const filled = i < Math.floor(clampedValue);
          const partial = !filled && i < clampedValue;

          return (
            <Star
              key={i}
              size={icon}
              className={cn(
                filled
                  ? "text-gold-400 fill-gold-400"
                  : partial
                    ? "text-gold-400 fill-gold-400/50"
                    : "text-cream-400 fill-cream-400"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-medium text-bark-400", text)}>
          {clampedValue.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className={cn("text-cream-600", text)}>
          ({count})
        </span>
      )}
    </div>
  );
}
