import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import { Badge } from "@/components/ui/badge";
import { Prisma } from "@prisma/client";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All Perfumes ",
  description:
    "Browse our complete catalog of perfumes. Filter by gender, sort by name or year.",
};

const PER_PAGE = 24;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PerfumesCatalogPage({ searchParams }: Props) {
  const sp = await searchParams;

  const page = Math.max(1, parseInt(String(sp.page ?? "1"), 10) || 1);
  const gender = typeof sp.gender === "string" ? sp.gender : undefined;
  const concentration = typeof sp.concentration === "string" ? sp.concentration : undefined;
  const brandSlug = typeof sp.brand === "string" ? sp.brand : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : "name";

  // Build where clause
  const where: Prisma.PerfumeWhereInput = {};
  if (gender) where.gender = gender;
  if (concentration) where.concentration = concentration;
  if (brandSlug) where.brand = { slug: brandSlug };

  // Build orderBy
  let orderBy: Prisma.PerfumeOrderByWithRelationInput;
  switch (sort) {
    case "year":
      orderBy = { year: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    default:
      orderBy = { name: "asc" };
  }

  const [perfumes, total, brands, concentrations] = await Promise.all([
    db.perfume.findMany({
      where,
      orderBy,
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        brand: true,
        accords: {
          include: { accord: true },
          orderBy: { intensity: "desc" },
          take: 3,
        },
        _count: { select: { reviews: true } },
      },
    }),
    db.perfume.count({ where }),
    db.brand.findMany({
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.perfume.groupBy({
      by: ["concentration"],
      _count: { _all: true },
      orderBy: { concentration: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  // Build filter URL helper
  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = { gender, concentration, brand: brandSlug, sort, page: String(page), ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "undefined") params.set(k, v);
    }
    // Reset page when changing filters
    if (overrides.gender !== undefined || overrides.sort !== undefined || overrides.concentration !== undefined || overrides.brand !== undefined) {
      params.delete("page");
    }
    return `/perfumes?${params.toString()}`;
  }

  const genderOptions = [
    { value: undefined, label: "All" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unisex", label: "Unisex" },
  ];

  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "year", label: "Year (newest)" },
    { value: "newest", label: "Recently added" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-bark-500 mb-2">Perfumes</h1>
        <p className="text-sm text-cream-500">
          {total} {total === 1 ? "fragrance" : "fragrances"} found
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Gender filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-cream-500 mr-2">
            Gender:
          </span>
          {genderOptions.map((opt) => (
            <Link
              key={opt.label}
              href={buildUrl({ gender: opt.value })}
              className="no-underline"
            >
              <Badge
                variant={
                  (gender ?? undefined) === opt.value ? "gold" : "default"
                }
              >
                {opt.label}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Concentration filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-cream-500 mr-2">
            Type:
          </span>
          <Link href={buildUrl({ concentration: undefined })} className="no-underline">
            <Badge variant={!concentration ? "gold" : "default"}>All</Badge>
          </Link>
          {concentrations.map((c) => (
            <Link
              key={c.concentration}
              href={buildUrl({ concentration: c.concentration })}
              className="no-underline"
            >
              <Badge variant={concentration === c.concentration ? "gold" : "default"}>
                {c.concentration} ({c._count._all})
              </Badge>
            </Link>
          ))}
        </div>

        {/* Brand filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-cream-500 mr-2">
            Brand:
          </span>
          <Link href={buildUrl({ brand: undefined })} className="no-underline">
            <Badge variant={!brandSlug ? "gold" : "default"}>All</Badge>
          </Link>
          {brandSlug && (
            <Link href={buildUrl({ brand: undefined })} className="no-underline">
              <Badge variant="gold">
                {brands.find((b) => b.slug === brandSlug)?.name ?? brandSlug} ✕
              </Badge>
            </Link>
          )}
          {!brandSlug && brands.slice(0, 10).map((b) => (
            <Link key={b.slug} href={buildUrl({ brand: b.slug })} className="no-underline">
              <Badge variant="default">{b.name}</Badge>
            </Link>
          ))}
          {!brandSlug && brands.length > 10 && (
            <span className="text-xs text-cream-600">+{brands.length - 10} more</span>
          )}
        </div>

        {/* Sort */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-cream-500 mr-2">
            Sort:
          </span>
          {sortOptions.map((opt) => (
            <Link
              key={opt.value}
              href={buildUrl({ sort: opt.value })}
              className="no-underline"
            >
              <Badge variant={sort === opt.value ? "gold" : "default"}>
                {opt.label}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
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
          <p className="text-cream-500">No perfumes found matching your filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-4 pt-4">
          {page > 1 ? (
            <Link
              href={buildUrl({ page: String(page - 1) })}
              className="text-sm font-medium text-gold-500 no-underline hover:text-gold-600"
            >
              &larr; Previous
            </Link>
          ) : (
            <span className="text-sm font-medium text-cream-400">
              &larr; Previous
            </span>
          )}

          <span className="text-sm text-bark-300">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={buildUrl({ page: String(page + 1) })}
              className="text-sm font-medium text-gold-500 no-underline hover:text-gold-600"
            >
              Next &rarr;
            </Link>
          ) : (
            <span className="text-sm font-medium text-cream-400">
              Next &rarr;
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
