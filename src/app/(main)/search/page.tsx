import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Advanced Search | Perfumare",
  description:
    "Search for perfumes by keyword, gender, and concentration.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const gender = typeof sp.gender === "string" ? sp.gender : "";
  const concentration = typeof sp.concentration === "string" ? sp.concentration : "";

  const hasSearch = q || gender || concentration;

  // Only query if we have search params
  let perfumes: Awaited<ReturnType<typeof fetchResults>> = [];
  if (hasSearch) {
    perfumes = await fetchResults(q, gender, concentration);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-bark-500 mb-2">
          Advanced Search
        </h1>
        <p className="text-sm text-cream-500">
          Find your perfect fragrance
        </p>
      </div>

      {/* Search Form */}
      <form action="/search" method="GET" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="q"
              className="text-sm font-medium text-bark-400"
            >
              Keyword
            </label>
            <input
              id="q"
              name="q"
              type="text"
              defaultValue={q}
              placeholder="e.g. oud, vanilla, rose..."
              className="w-full rounded-md border border-cream-400 bg-white px-3 py-2 text-sm text-bark-500 placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="gender"
              className="text-sm font-medium text-bark-400"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              defaultValue={gender}
              className="w-full rounded-md border border-cream-400 bg-white px-3 py-2 text-sm text-bark-500 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          {/* Concentration */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="concentration"
              className="text-sm font-medium text-bark-400"
            >
              Concentration
            </label>
            <select
              id="concentration"
              name="concentration"
              defaultValue={concentration}
              className="w-full rounded-md border border-cream-400 bg-white px-3 py-2 text-sm text-bark-500 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
            >
              <option value="">All</option>
              <option value="EDP">Eau de Parfum</option>
              <option value="EDT">Eau de Toilette</option>
              <option value="EDC">Eau de Cologne</option>
              <option value="Parfum">Parfum</option>
              <option value="Attar">Attar</option>
            </select>
          </div>
        </div>

        <Button type="submit" size="md">
          Search
        </Button>
      </form>

      {/* Results */}
      {hasSearch && (
        <section>
          <h2 className="section-title mb-4">
            Results ({perfumes.length})
          </h2>

          {perfumes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {perfumes.map((p) => {
                const topAccords = p.accords.map((a) => ({
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
            <div className="text-center py-12">
              <p className="text-cream-500">
                No perfumes found matching your criteria. Try different keywords or
                filters.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

async function fetchResults(q: string, gender: string, concentration: string) {
  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { brand: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (gender) {
    where.gender = gender;
  }

  if (concentration) {
    where.concentration = concentration;
  }

  return db.perfume.findMany({
    where,
    take: 48,
    orderBy: { name: "asc" },
    include: {
      brand: true,
      accords: {
        include: { accord: true },
        orderBy: { intensity: "desc" },
        take: 3,
      },
      _count: { select: { reviews: true } },
    },
  });
}
