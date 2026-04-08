"use client";

import { useState } from "react";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

type Gender = "male" | "female" | "unisex";
type Occasion = "daily" | "special" | "night" | "work";

const scentFamilies = [
  { key: "Woody", emoji: "\ud83e\udeb5" },
  { key: "Floral", emoji: "\ud83c\udf39" },
  { key: "Spicy", emoji: "\ud83d\udd25" },
  { key: "Oriental", emoji: "\ud83d\udd4c" },
  { key: "Fresh", emoji: "\ud83c\udf3f" },
  { key: "Citrus", emoji: "\ud83c\udf4b" },
  { key: "Gourmand", emoji: "\ud83c\udf6c" },
  { key: "Aquatic", emoji: "\ud83d\udca7" },
  { key: "Green", emoji: "\ud83c\udf31" },
  { key: "Earthy", emoji: "\ud83e\udea8" },
  { key: "Musky", emoji: "\u2728" },
];

const occasions = [
  { key: "daily" as Occasion, label: "Daily Wear", emoji: "\u2600\ufe0f", desc: "Everyday versatility" },
  { key: "special" as Occasion, label: "Special Occasion", emoji: "\ud83c\udf89", desc: "Stand out moments" },
  { key: "night" as Occasion, label: "Night Out", emoji: "\ud83c\udf19", desc: "Evening & nightlife" },
  { key: "work" as Occasion, label: "Work / Office", emoji: "\ud83d\udcbc", desc: "Professional & subtle" },
];

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  brand: { name: string };
  year: number | null;
  concentration: string;
  imageUrl: string | null;
  accords: { accord: { name: string; color: string } }[];
  _count: { reviews: number };
}

export default function FinderPage() {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<Gender | null>(null);
  const [families, setFamilies] = useState<string[]>([]);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFamily = (f: string) => {
    setFamilies((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (gender) params.set("gender", gender);
      // Use first family as keyword approximation
      if (families.length > 0) params.set("q", families[0]);

      const res = await fetch(`/api/search/finder?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
      setStep(4);
    }
  };

  const reset = () => {
    setStep(1);
    setGender(null);
    setFamilies([]);
    setOccasion(null);
    setResults([]);
  };

  const progressWidth = `${(step / 4) * 100}%`;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-serif text-bark-500 mb-2">
          Perfume Finder
        </h1>
        <p className="text-cream-500">
          Answer a few questions and we will recommend the perfect fragrance for
          you
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-cream-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gold-500 rounded-full transition-all duration-500"
          style={{ width: progressWidth }}
        />
      </div>
      <div className="flex justify-between text-xs text-cream-500">
        <span className={cn(step >= 1 && "text-gold-500 font-medium")}>
          Gender
        </span>
        <span className={cn(step >= 2 && "text-gold-500 font-medium")}>
          Scent Family
        </span>
        <span className={cn(step >= 3 && "text-gold-500 font-medium")}>
          Occasion
        </span>
        <span className={cn(step >= 4 && "text-gold-500 font-medium")}>
          Results
        </span>
      </div>

      {/* Step 1: Gender */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-serif text-bark-500 text-center">
            What are you looking for?
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {(
              [
                { key: "male" as Gender, label: "Men", emoji: "\ud83d\udc68" },
                { key: "female" as Gender, label: "Women", emoji: "\ud83d\udc69" },
                { key: "unisex" as Gender, label: "Unisex", emoji: "\u2728" },
              ] as const
            ).map((g) => (
              <button
                key={g.key}
                onClick={() => setGender(g.key)}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                  gender === g.key
                    ? "border-gold-500 bg-gold-50 shadow-card-hover"
                    : "border-cream-300 bg-white hover:border-gold-300 hover:shadow-card"
                )}
              >
                <span className="text-4xl">{g.emoji}</span>
                <span className="font-medium text-bark-400">{g.label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => gender && setStep(2)}
              disabled={!gender}
              className="gap-2"
            >
              Next <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Scent Family */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-serif text-bark-500 text-center">
            What scent families do you prefer?
          </h2>
          <p className="text-sm text-cream-500 text-center">
            Select one or more
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {scentFamilies.map((sf) => (
              <button
                key={sf.key}
                onClick={() => toggleFamily(sf.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all duration-200 cursor-pointer text-sm font-medium",
                  families.includes(sf.key)
                    ? "border-gold-500 bg-gold-50 text-gold-600 shadow-card"
                    : "border-cream-300 bg-white text-bark-400 hover:border-gold-300"
                )}
              >
                <span>{sf.emoji}</span>
                {sf.key}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
            <Button
              onClick={() => families.length > 0 && setStep(3)}
              disabled={families.length === 0}
              className="gap-2"
            >
              Next <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Occasion */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-serif text-bark-500 text-center">
            What occasion?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {occasions.map((o) => (
              <button
                key={o.key}
                onClick={() => setOccasion(o.key)}
                className={cn(
                  "flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                  occasion === o.key
                    ? "border-gold-500 bg-gold-50 shadow-card-hover"
                    : "border-cream-300 bg-white hover:border-gold-300 hover:shadow-card"
                )}
              >
                <span className="text-3xl">{o.emoji}</span>
                <span className="font-medium text-bark-400">{o.label}</span>
                <span className="text-xs text-cream-500">{o.desc}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)} className="gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
            <Button
              onClick={() => occasion && fetchResults()}
              disabled={!occasion || loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Find Perfumes
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-serif text-bark-500 mb-2">
              Your Recommendations
            </h2>
            <p className="text-sm text-cream-500">
              Based on your preferences:{" "}
              <span className="text-bark-400">
                {gender} / {families.join(", ")} / {occasion}
              </span>
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {results.map((p) => {
                const topAccords = p.accords
                  .slice(0, 3)
                  .map((a) => ({
                    name: a.accord.name,
                    color: a.accord.color,
                  }));
                return (
                  <PerfumeCard
                    key={p.id}
                    slug={p.slug}
                    name={p.name}
                    brand={p.brand.name}
                    year={p.year}
                    concentration={p.concentration}
                    imageUrl={p.imageUrl}
                    rating={0}
                    reviewCount={p._count.reviews}
                    topAccords={topAccords}
                  />
                );
              })}
            </div>
          ) : (
            <Card>
              <CardBody className="text-center py-12">
                <Sparkles
                  size={40}
                  className="mx-auto mb-4 text-cream-400"
                  strokeWidth={1.2}
                />
                <p className="text-cream-500 mb-2 text-lg font-serif">
                  No exact matches found
                </p>
                <p className="text-sm text-cream-500 mb-4">
                  Try adjusting your preferences or browse all perfumes.
                </p>
              </CardBody>
            </Card>
          )}

          <div className="flex justify-center">
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcw size={16} /> Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
