"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const localeLabels: Record<string, string> = {
  en: "EN",
  es: "ES",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function switchLocale(newLocale: string) {
    startTransition(async () => {
      document.cookie = `locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
      window.location.reload();
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Globe size={14} className="text-bark-300" />
      {Object.entries(localeLabels).map(([key, label]) => (
        <button
          key={key}
          onClick={() => switchLocale(key)}
          disabled={isPending}
          className={cn(
            "text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded transition-colors",
            locale === key
              ? "text-gold-500 bg-gold-500/10"
              : "text-bark-300 hover:text-gold-400"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
