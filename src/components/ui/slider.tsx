"use client";

import { cn } from "@/lib/utils";

interface SliderProps {
  label?: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  labels?: { min: string; max: string };
  showValue?: boolean;
  className?: string;
}

export function Slider({
  label,
  min,
  max,
  value,
  onChange,
  labels,
  showValue = true,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-bark-400">{label}</span>
          {showValue && (
            <span className="text-sm font-semibold text-gold-500">{value}</span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-gold-500"
        style={{
          background: `linear-gradient(to right, var(--color-gold-500) 0%, var(--color-gold-500) ${percentage}%, var(--color-cream-300) ${percentage}%, var(--color-cream-300) 100%)`,
        }}
      />
      {labels && (
        <div className="flex justify-between text-xs text-cream-600">
          <span>{labels.min}</span>
          <span>{labels.max}</span>
        </div>
      )}
    </div>
  );
}
