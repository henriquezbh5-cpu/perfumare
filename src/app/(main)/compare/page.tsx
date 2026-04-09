"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PerfumeBottleSvg } from "@/components/ui/perfume-bottle-svg";
import { cn } from "@/lib/utils";
import { Search, X, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

interface PerfumeResult {
  slug: string;
  name: string;
  brand: string;
  year: number | null;
  gender: string;
  concentration: string;
  imageUrl: string | null;
  description: string | null;
  accords: { name: string; color: string; intensity: number }[];
  notes: { name: string; layer: string }[];
}

interface SearchItem {
  type: string;
  name: string;
  slug: string;
  extra?: string;
}

function CompareSearch({
  label,
  selected,
  onSelect,
  onClear,
}: {
  label: string;
  selected: PerfumeResult | null;
  onSelect: (slug: string) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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
        const data = await res.json();
        const perfumes = (data.results as SearchItem[]).filter(
          (r) => r.type === "Perfume"
        );
        setResults(perfumes);
        setIsOpen(perfumes.length > 0);
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (selected) {
    return (
      <div className="relative">
        <div className="flex items-center justify-between p-3 bg-gold-50 border border-gold-300 rounded-lg">
          <div className="flex items-center gap-3">
            {selected.imageUrl ? (
              <img
                src={selected.imageUrl}
                alt={selected.name}
                className="w-10 h-12 object-cover rounded"
              />
            ) : (
              <PerfumeBottleSvg
                color={selected.accords[0]?.color ?? "#c9a962"}
                size="sm"
              />
            )}
            <div>
              <p className="font-serif text-bark-500 text-sm">{selected.name}</p>
              <p className="text-xs text-cream-500">{selected.brand}</p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-1 text-cream-500 hover:text-bark-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="text-xs font-medium uppercase tracking-widest text-cream-500 mb-2 block">
        {label}
      </label>
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-500"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search for a perfume..."
          className="w-full rounded-lg border border-cream-400/20 bg-cream-200/30 backdrop-blur-sm pl-9 pr-4 py-3 text-sm text-bark-500 placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-cream-100/95 backdrop-blur-xl border border-cream-300/20 rounded-lg shadow-card-hover z-50 max-h-60 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.slug}
              onClick={() => {
                onSelect(item.slug);
                setQuery("");
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm text-bark-400 hover:bg-cream-100 transition-colors flex items-center justify-between"
            >
              <span>{item.name}</span>
              {item.extra && (
                <span className="text-xs text-cream-500">{item.extra}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  const [perfumeA, setPerfumeA] = useState<PerfumeResult | null>(null);
  const [perfumeB, setPerfumeB] = useState<PerfumeResult | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  const fetchPerfume = async (
    slug: string,
    setter: (p: PerfumeResult) => void,
    setLoading: (b: boolean) => void
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/perfume/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setter(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const renderColumn = (perfume: PerfumeResult | null, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!perfume) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ArrowLeftRight size={40} className="text-cream-300 mb-4" />
          <p className="text-cream-500">Search and select a perfume above</p>
        </div>
      );
    }

    const topNotes = perfume.notes.filter((n) => n.layer === "top");
    const heartNotes = perfume.notes.filter((n) => n.layer === "middle");
    const baseNotes = perfume.notes.filter((n) => n.layer === "base");

    return (
      <div className="space-y-6">
        {/* Image */}
        <div className="flex justify-center">
          {perfume.imageUrl ? (
            <img
              src={perfume.imageUrl}
              alt={perfume.name}
              className="w-32 h-40 object-cover rounded-lg"
            />
          ) : (
            <PerfumeBottleSvg
              color={perfume.accords[0]?.color ?? "#c9a962"}
              size="lg"
            />
          )}
        </div>

        {/* Name */}
        <div className="text-center">
          <Link
            href={`/perfumes/${perfume.slug}`}
            className="font-serif text-lg text-bark-500 no-underline hover:text-gold-600 transition-colors"
          >
            {perfume.name}
          </Link>
          <p className="text-sm text-cream-500">{perfume.brand}</p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap justify-center gap-2">
          <Badge>{perfume.concentration}</Badge>
          <Badge>{perfume.gender}</Badge>
          {perfume.year && (
            <span className="text-xs text-cream-500">{perfume.year}</span>
          )}
        </div>

        {/* Accords */}
        {perfume.accords.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-widest text-cream-500 mb-2 text-center">
              Main Accords
            </h4>
            <div className="space-y-2">
              {perfume.accords.map((a) => (
                <div key={a.name} className="flex items-center gap-2">
                  <span className="text-xs text-bark-400 w-20 text-right shrink-0">
                    {a.name}
                  </span>
                  <div className="flex-1 h-4 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${a.intensity}%`,
                        backgroundColor: a.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-3">
          {topNotes.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-cream-500 mb-1 text-center">
                Top Notes
              </h4>
              <div className="flex flex-wrap justify-center gap-1">
                {topNotes.map((n) => (
                  <Badge key={n.name} className="text-[10px]">
                    {n.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {heartNotes.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-cream-500 mb-1 text-center">
                Heart Notes
              </h4>
              <div className="flex flex-wrap justify-center gap-1">
                {heartNotes.map((n) => (
                  <Badge key={n.name} className="text-[10px]">
                    {n.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {baseNotes.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-cream-500 mb-1 text-center">
                Base Notes
              </h4>
              <div className="flex flex-wrap justify-center gap-1">
                {baseNotes.map((n) => (
                  <Badge key={n.name} className="text-[10px]">
                    {n.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-serif text-bark-500 mb-2">
          Compare Perfumes
        </h1>
        <p className="text-cream-500">
          Select two perfumes to compare side by side
        </p>
      </div>

      {/* Search inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompareSearch
          label="Perfume A"
          selected={perfumeA}
          onSelect={(slug) =>
            fetchPerfume(slug, setPerfumeA, setLoadingA)
          }
          onClear={() => setPerfumeA(null)}
        />
        <CompareSearch
          label="Perfume B"
          selected={perfumeB}
          onSelect={(slug) =>
            fetchPerfume(slug, setPerfumeB, setLoadingB)
          }
          onClear={() => setPerfumeB(null)}
        />
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>{renderColumn(perfumeA, loadingA)}</CardBody>
        </Card>
        <Card>
          <CardBody>{renderColumn(perfumeB, loadingB)}</CardBody>
        </Card>
      </div>
    </div>
  );
}
