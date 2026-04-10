import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Advanced Search ",
  description: "Search for perfumes by keyword, gender, concentration, note family, year, and brand.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const gender = typeof sp.gender === "string" ? sp.gender : "";
  const concentration = typeof sp.concentration === "string" ? sp.concentration : "";
  const noteFamily = typeof sp.noteFamily === "string" ? sp.noteFamily : "";
  const yearFrom = typeof sp.yearFrom === "string" ? sp.yearFrom : "";
  const yearTo = typeof sp.yearTo === "string" ? sp.yearTo : "";
  const brand = typeof sp.brand === "string" ? sp.brand : "";

  const hasSearch = q || gender || concentration || noteFamily || yearFrom || yearTo || brand;

  let perfumes: Awaited<ReturnType<typeof fetchResults>> = [];
  if (hasSearch) {
    perfumes = await fetchResults({ q, gender, concentration, noteFamily, yearFrom, yearTo, brand });
  }

  // Fetch brands for dropdown
  const brands = await db.brand.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-bark-500 mb-2 text-glow">
          Advanced Search
        </h1>
        <p className="text-sm text-cream-500">
          Find your perfect fragrance with precision filters
        </p>
      </div>

      {/* Search Form */}
      <form action="/search" method="GET" className="glass-card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword */}
          <div className="flex flex-col gap-1">
            <label htmlFor="q" className="text-sm font-medium text-bark-400">
              Keyword
            </label>
            <input
              id="q"
              name="q"
              type="text"
              defaultValue={q}
              placeholder="e.g. oud, vanilla, rose..."
              className="w-full rounded-lg border border-cream-400/20 bg-cream-200/30 backdrop-blur-sm px-3 py-2 text-sm text-bark-500 placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400/50"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <label htmlFor="gender" className="text-sm font-medium text-bark-400">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              defaultValue={gender}
              className="w-full rounded-lg border border-cream-400/20 bg-cream-200/30 backdrop-blur-sm px-3 py-2 text-sm text-bark-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          {/* Concentration */}
          <div className="flex flex-col gap-1">
            <label htmlFor="concentration" className="text-sm font-medium text-bark-400">
              Concentration
            </label>
            <select
              id="concentration"
              name="concentration"
              defaultValue={concentration}
              className="w-full rounded-lg border border-cream-400/20 bg-cream-200/30 backdrop-blur-sm px-3 py-2 text-sm text-bark-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
            >
              <option value="">All</option>
              <option value="EDP">Eau de Parfum</option>
              <option value="EDT">Eau de Toilette</option>
              <option value="EDC">Eau de Cologne</option>
              <option value="Parfum">Parfum</option>
              <option value="Attar">Attar</option>
            </select>
          </div>

          {/* Note Family */}
          <div className="flex flex-col gap-1">
            <label htmlFor="noteFamily" className="text-sm font-medium text-bark-400">
              Note Family
            </label>
            <select
              id="noteFamily"
              name="noteFamily"
              defaultValue={noteFamily}
              className="w-full rounded-lg border border-cream-400/20 bg-cream-200/30 backdrop-blur-sm px-3 py-2 text-sm text-bark-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
            >
              <option value="">All</option>
              <option value="Floral">Floral</option>
              <option value="Woody">Woody</option>
              <option value="Oriental">Oriental</option>
              <option value="Fresh">Fresh</option>
              <option value="Spicy">Spicy</option>
              <option value="Citrus">Citrus</option>
              <option value="Gourmand">Gourmand</option>
              <option value="Aquatic">Aquatic</option>
              <option value="Green">Green</option>
              <option value="Earthy">Earthy</option>
              <option value="Musky">Musky</option>
            </select>
          </div>

          {/* Brand */}
          <div className="flex flex-col gap-1">
            <label htmlFor="brand" className="text-sm font-medium text-bark-400">
              Brand
            </label>
            <select
              id="brand"
              name="brand"
              defaultValue={brand}
              className="w-full rounded-lg border border-cream-400/20 bg-cream-200/30 backdrop-blur-sm px-3 py-2 text-sm text-bark-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Range */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-bark-400">Year Range</label>
            <div className="flex gap-2">
              <input
                name="yearFrom"
                type="number"
                defaultValue={yearFrom}
                placeholder="From"
                min="1900"
                max="2030"
                className="w-full rounded-lg border border-cream-400/20 bg-cream-200/30 backdrop-blur-sm px-3 py-2 text-sm text-bark-500 placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
              />
              <input
                name="yearTo"
                type="number"
                defaultValue={yearTo}
                placeholder="To"
                min="1900"
                max="2030"
                className="w-full rounded-lg border border-cream-400/20 bg-cream-200/30 backdrop-blur-sm px-3 py-2 text-sm text-bark-500 placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" size="md">
            Search
          </Button>
          <a href="/search">
            <Button type="button" variant="ghost" size="md">
              Clear Filters
            </Button>
          </a>
        </div>
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
                No perfumes found matching your criteria. Try different keywords or filters.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

interface SearchFilters {
  q: string;
  gender: string;
  concentration: string;
  noteFamily: string;
  yearFrom: string;
  yearTo: string;
  brand: string;
}

async function fetchResults(filters: SearchFilters) {
  const where: Record<string, unknown> = {};

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
      { brand: { name: { contains: filters.q, mode: "insensitive" } } },
    ];
  }

  if (filters.gender) where.gender = filters.gender;
  if (filters.concentration) where.concentration = filters.concentration;
  if (filters.brand) where.brand = { slug: filters.brand };

  if (filters.noteFamily) {
    where.notes = {
      some: { note: { family: { equals: filters.noteFamily, mode: "insensitive" } } },
    };
  }

  if (filters.yearFrom || filters.yearTo) {
    where.year = {};
    if (filters.yearFrom) (where.year as Record<string, number>).gte = parseInt(filters.yearFrom);
    if (filters.yearTo) (where.year as Record<string, number>).lte = parseInt(filters.yearTo);
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
