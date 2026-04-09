"use client";

import { useWardrobe } from "@/hooks/use-wardrobe";
import { AuthGuard } from "@/components/auth/auth-guard";
import { cn } from "@/lib/utils";
import { Heart, ShoppingBag, Archive } from "lucide-react";

interface WardrobeButtonsProps {
  perfumeId: string;
  className?: string;
}

const buttons = [
  { status: "have" as const, label: "Have", icon: ShoppingBag },
  { status: "want" as const, label: "Want", icon: Heart },
  { status: "had" as const, label: "Had", icon: Archive },
];

export function WardrobeButtons({ perfumeId, className }: WardrobeButtonsProps) {
  const { status, isLoading, toggle } = useWardrobe(perfumeId);

  return (
    <AuthGuard>
      <div className={cn("flex gap-2", className)}>
        {buttons.map((btn) => {
          const isActive = status === btn.status;
          const Icon = btn.icon;

          return (
            <button
              key={btn.status}
              onClick={() => toggle(btn.status)}
              disabled={isLoading}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                isActive
                  ? "bg-gold-500 text-white border-gold-500 shadow-sm"
                  : "bg-cream-200/20 text-bark-300 border-cream-400/20 hover:border-gold-400 hover:text-gold-500",
                isLoading && "opacity-50 pointer-events-none"
              )}
            >
              <Icon size={16} />
              {btn.label}
            </button>
          );
        })}
      </div>
    </AuthGuard>
  );
}
