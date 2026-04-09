"use client";

import { cn } from "@/lib/utils";

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 border-b border-cream-300", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px",
            activeTab === tab.key
              ? "border-gold-500 text-gold-500"
              : "border-transparent text-bark-200 hover:text-bark-400 hover:border-cream-400"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                activeTab === tab.key
                  ? "bg-gold-100 text-gold-600"
                  : "bg-cream-200 text-bark-200"
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
