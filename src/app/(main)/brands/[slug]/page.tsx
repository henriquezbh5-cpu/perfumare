import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getInitials } from "@/lib/utils";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import { Badge } from "@/components/ui/badge";

export const revalidate = 86400;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getBrand(slug: string) {
  return db.brand.findUnique({
    where: { slug },
    include: {
      perfumes: {
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
      },
      _count: { select: { perfumes: true } },
    },
  });
}

export async function generateStaticParams() {
  const brands = await db.brand.findMany({ select: { slug: true } });
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand) {
    return { title: "Brand Not Found" };
  }

  return {
    title: `${brand.name} Perfumes | 1000PerfumesNight`,
    description:
      brand.description ??
      `Explore all ${brand._count.perfumes} perfumes by ${brand.name}.`,
  };
}

export default async function BrandDetailPage({ params }: Props) {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-cream-500">
        <Link href="/" className="hover:text-gold-500 no-underline text-cream-500">
          Home
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <Link href="/brands" className="hover:text-gold-500 no-underline text-cream-500">
          Brands
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-bark-400">{brand.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-bark-500 text-gold-400 flex items-center justify-center text-2xl font-serif shrink-0">
          {getInitials(brand.name)}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-serif text-bark-500">{brand.name}</h1>
            {brand.category === "Arabian" && (
              <Badge variant="arabian">Arabian</Badge>
            )}
            {brand.category === "Designer" && (
              <Badge>Designer</Badge>
            )}
            {brand.category === "Niche" && (
              <Badge variant="gold">Niche</Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-cream-500">
            {brand.country && <span>{brand.country}</span>}
            {brand.founded && <span>Est. {brand.founded}</span>}
            <span>
              {brand._count.perfumes}{" "}
              {brand._count.perfumes === 1 ? "perfume" : "perfumes"}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {brand.description && (
        <p className="text-bark-300 leading-relaxed max-w-3xl">
          {brand.description}
        </p>
      )}

      {/* Perfumes Grid */}
      <section>
        <h2 className="section-title mb-6">
          All Perfumes by {brand.name}
        </h2>
        {brand.perfumes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brand.perfumes.map((p) => {
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
          <p className="text-center text-cream-500 py-8">
            No perfumes listed yet for this brand.
          </p>
        )}
      </section>
    </div>
  );
}
