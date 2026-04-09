"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Rating } from "@/components/ui/rating";

type WardrobeStatus = "have" | "want" | "had";

interface WardrobeItem {
  status: string;
  personalRating: number | null;
  perfume: {
    slug: string;
    name: string;
    imageUrl: string | null;
    gender: string;
    concentration: string;
    brand: { name: string; slug: string };
  };
}

export function WardrobeTab() {
  const { data: session } = useSession();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [filter, setFilter] = useState<WardrobeStatus>("have");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    setLoading(true);
    fetch(`/api/wardrobe?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const counts = {
    have: items.filter((i) => i.status === "have").length,
    want: items.filter((i) => i.status === "want").length,
    had: items.filter((i) => i.status === "had").length,
  };

  const filtered = items.filter((i) => i.status === filter);

  const filters: { key: WardrobeStatus; label: string }[] = [
    { key: "have", label: "Have" },
    { key: "want", label: "Want" },
    { key: "had", label: "Had" },
  ];

  if (loading) {
    return <div className="text-center py-12 text-bark-200">Loading wardrobe...</div>;
  }

  return (
    <div>
      {/* Sub-filters */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
              filter === f.key
                ? "bg-gold-500 text-white border-gold-500"
                : "bg-cream-200/20 text-bark-300 border-cream-400/20 hover:border-gold-400"
            )}
          >
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-bark-200 mb-2">No perfumes in your {filter} list yet.</p>
          <Link href="/perfumes" className="text-sm text-gold-500 hover:text-gold-600">
            Start exploring perfumes &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <Link
              key={item.perfume.slug}
              href={`/perfumes/${item.perfume.slug}`}
              className="group bg-cream-200/30 backdrop-blur-sm border border-cream-300/20 rounded-lg p-4 hover:shadow-card-hover transition-shadow"
            >
              <div className="aspect-square bg-cream-100 rounded-md mb-3 flex items-center justify-center">
                {item.perfume.imageUrl ? (
                  <img
                    src={item.perfume.imageUrl}
                    alt={item.perfume.name}
                    className="object-contain h-full w-full rounded-md"
                  />
                ) : (
                  <span className="text-3xl">🧴</span>
                )}
              </div>
              <h4 className="font-medium text-sm text-bark-500 group-hover:text-gold-500 transition-colors line-clamp-1">
                {item.perfume.name}
              </h4>
              <p className="text-xs text-bark-200">{item.perfume.brand.name}</p>
              {item.personalRating && (
                <Rating value={item.personalRating} size="sm" className="mt-1" />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
