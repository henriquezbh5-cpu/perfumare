"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: "Perfume" | "Brand" | "Note" | "Perfumer";
  name: string;
  slug: string;
  extra?: string;
}

interface SearchResponse {
  results: SearchResult[];
}

const typeRoutes: Record<string, string> = {
  Perfume: "/perfumes",
  Brand: "/brands",
  Note: "/notes",
  Perfumer: "/perfumers",
};

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data: SearchResponse = await res.json();
        setResults(data.results);
        setIsOpen(data.results.length > 0);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    const base = typeRoutes[result.type] ?? "/perfumes";
    router.push(`${base}/${result.slug}`);
  };

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-500"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search perfumes, brands, notes..."
          className="w-full rounded-full border border-cream-400 bg-white pl-9 pr-4 py-2 text-sm text-bark-500 placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-cream-300 rounded-lg shadow-card-hover z-50 max-h-80 overflow-y-auto">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-cream-500 bg-cream-50">
                {type}s
              </div>
              {items.map((item) => (
                <button
                  key={`${item.type}-${item.slug}`}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-3 py-2 text-sm text-bark-400 hover:bg-cream-100 transition-colors flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  {item.extra && (
                    <span className="text-xs text-cream-500">{item.extra}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
