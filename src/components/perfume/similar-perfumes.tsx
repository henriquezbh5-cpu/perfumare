"use client";

import { useState } from "react";
import Link from "next/link";
import { TransparentImage } from "@/components/ui/transparent-image";
import { PerfumeBottleSvg } from "@/components/ui/perfume-bottle-svg";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface Accord {
  name: string;
  color: string;
  intensity: number;
}

interface SimilarPerfume {
  slug: string;
  name: string;
  brand: string;
  year: number | null;
  concentration: string;
  imageUrl: string | null;
  rating: number;
  reviewCount: number;
  accords: Accord[];
  sharedNotes: string[];
  similarity: number;
}

interface CurrentPerfume {
  name: string;
  brand: string;
  imageUrl: string | null;
  accords: Accord[];
}

interface SimilarPerfumesProps {
  current: CurrentPerfume;
  similars: SimilarPerfume[];
}

function AccordCompareBar({
  name,
  color,
  currentIntensity,
  similarIntensity,
}: {
  name: string;
  color: string;
  currentIntensity: number;
  similarIntensity: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Current perfume bar (right-aligned) */}
      <div className="flex-1 flex justify-end">
        <div className="relative h-3 w-full rounded-full bg-cream-200/30 overflow-hidden">
          <div
            className="absolute right-0 h-full rounded-full transition-all duration-700"
            style={{
              width: `${currentIntensity}%`,
              backgroundColor: color,
              opacity: 0.6,
            }}
          />
        </div>
      </div>

      {/* Label */}
      <span className="text-[10px] text-bark-300 w-16 text-center shrink-0 font-medium">
        {name}
      </span>

      {/* Similar perfume bar (left-aligned) */}
      <div className="flex-1">
        <div className="relative h-3 w-full rounded-full bg-cream-200/30 overflow-hidden">
          <div
            className="absolute left-0 h-full rounded-full transition-all duration-700"
            style={{
              width: `${similarIntensity}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function SimilarityRing({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 22;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-cream-300/20"
        />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="url(#gold-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#f0d080" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gold-500">
        {value}%
      </span>
    </div>
  );
}

function CompareCard({
  current,
  similar,
  isActive,
}: {
  current: CurrentPerfume;
  similar: SimilarPerfume;
  isActive: boolean;
}) {
  // Merge all accord names from both
  const allAccordNames = new Set([
    ...current.accords.map((a) => a.name),
    ...similar.accords.map((a) => a.name),
  ]);

  const compareAccords = Array.from(allAccordNames)
    .map((name) => {
      const cur = current.accords.find((a) => a.name === name);
      const sim = similar.accords.find((a) => a.name === name);
      return {
        name,
        color: cur?.color ?? sim?.color ?? "#888",
        currentIntensity: cur?.intensity ?? 0,
        similarIntensity: sim?.intensity ?? 0,
      };
    })
    .sort(
      (a, b) =>
        Math.max(b.currentIntensity, b.similarIntensity) -
        Math.max(a.currentIntensity, a.similarIntensity)
    )
    .slice(0, 6);

  const mainColor =
    similar.accords.sort((a, b) => b.intensity - a.intensity)[0]?.color ??
    "#d4a853";

  return (
    <div
      className={cn(
        "glass-card overflow-hidden transition-all duration-500",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute pointer-events-none"
      )}
    >
      {/* Header: VS comparison */}
      <div className="p-5 pb-0">
        <div className="flex items-center gap-4">
          {/* Current perfume mini */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-16 h-20 rounded-lg bg-cream-200/10 flex items-center justify-center shrink-0 overflow-hidden">
              {current.imageUrl ? (
                <TransparentImage
                  src={current.imageUrl}
                  alt={current.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <PerfumeBottleSvg color={mainColor} size="sm" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-cream-600 uppercase tracking-wider">
                Current
              </p>
              <p className="text-sm font-serif text-bark-400 truncate">
                {current.name}
              </p>
              <p className="text-xs text-cream-500">{current.brand}</p>
            </div>
          </div>

          {/* VS badge + similarity */}
          <div className="flex flex-col items-center shrink-0 mx-2">
            <SimilarityRing value={similar.similarity} />
            <span className="text-[9px] text-cream-600 mt-1 uppercase tracking-wider">
              match
            </span>
          </div>

          {/* Similar perfume */}
          <Link
            href={`/perfumes/${similar.slug}`}
            className="flex items-center gap-3 flex-1 min-w-0 no-underline group/sim"
          >
            <div className="min-w-0 text-right">
              <p className="text-[10px] text-cream-600 uppercase tracking-wider">
                Similar
              </p>
              <p className="text-sm font-serif text-bark-400 truncate group-hover/sim:text-gold-500 transition-colors">
                {similar.name}
              </p>
              <p className="text-xs text-cream-500">{similar.brand}</p>
            </div>
            <div className="w-16 h-20 rounded-lg bg-cream-200/10 flex items-center justify-center shrink-0 overflow-hidden">
              {similar.imageUrl ? (
                <TransparentImage
                  src={similar.imageUrl}
                  alt={similar.name}
                  className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover/sim:scale-110"
                />
              ) : (
                <PerfumeBottleSvg color={mainColor} size="sm" />
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Accord comparison bars */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex justify-between text-[9px] text-cream-600 uppercase tracking-wider mb-2 px-1">
          <span>{current.name.split(" ")[0]}</span>
          <span>Accords</span>
          <span>{similar.name.split(" ")[0]}</span>
        </div>
        <div className="space-y-1.5">
          {compareAccords.map((accord) => (
            <AccordCompareBar
              key={accord.name}
              name={accord.name}
              color={accord.color}
              currentIntensity={accord.currentIntensity}
              similarIntensity={accord.similarIntensity}
            />
          ))}
        </div>
      </div>

      {/* Shared notes */}
      {similar.sharedNotes.length > 0 && (
        <div className="px-5 pb-4 pt-2">
          <p className="text-[10px] text-cream-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles size={10} className="text-gold-500" />
            Shared Notes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {similar.sharedNotes.map((note) => (
              <span
                key={note}
                className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-cream-300/10 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge>{similar.concentration}</Badge>
          {similar.year && (
            <span className="text-xs text-cream-500">{similar.year}</span>
          )}
          <Rating
            value={similar.rating}
            size="sm"
            count={similar.reviewCount}
          />
        </div>
        <Link
          href={`/perfumes/${similar.slug}`}
          className="text-xs text-gold-500 hover:text-gold-400 no-underline flex items-center gap-1 transition-colors"
        >
          View <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

export function SimilarPerfumes({ current, similars }: SimilarPerfumesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (similars.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="section-title">You Might Also Like</h3>
          <p className="text-sm text-cream-500 mt-1">
            Fragrances with similar DNA
          </p>
        </div>

        {/* Navigation */}
        {similars.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setActiveIndex((i) => (i - 1 + similars.length) % similars.length)
              }
              className="p-1.5 rounded-lg border border-cream-300/20 text-cream-500 hover:text-gold-500 hover:border-gold-500/30 transition-colors"
              aria-label="Previous similar perfume"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-cream-600 w-12 text-center">
              {activeIndex + 1} / {similars.length}
            </span>
            <button
              onClick={() =>
                setActiveIndex((i) => (i + 1) % similars.length)
              }
              className="p-1.5 rounded-lg border border-cream-300/20 text-cream-500 hover:text-gold-500 hover:border-gold-500/30 transition-colors"
              aria-label="Next similar perfume"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail row */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {similars.map((s, i) => {
          const mainColor =
            s.accords.sort((a, b) => b.intensity - a.intensity)[0]?.color ??
            "#d4a853";
          return (
            <button
              key={s.slug}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "shrink-0 w-16 h-20 rounded-lg flex items-center justify-center overflow-hidden border transition-all duration-300",
                i === activeIndex
                  ? "border-gold-500/50 bg-gold-500/5 scale-105"
                  : "border-cream-300/10 bg-cream-100/5 hover:border-cream-300/30"
              )}
            >
              {s.imageUrl ? (
                <TransparentImage
                  src={s.imageUrl}
                  alt={s.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <PerfumeBottleSvg color={mainColor} size="sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active compare card */}
      <div className="relative min-h-[280px]">
        {similars.map((s, i) => (
          <CompareCard
            key={s.slug}
            current={current}
            similar={s}
            isActive={i === activeIndex}
          />
        ))}
      </div>
    </section>
  );
}
