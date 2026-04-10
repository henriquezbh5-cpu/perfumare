import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import { ArabianDivider } from "@/components/ui/arabian-patterns";
import { Trophy, Flame, DollarSign, Sparkles, Moon, Sun } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Perfumes — Curated Collections",
  description: "Discover the best perfumes for every occasion, budget, and style. Expert-curated collections of top-rated fragrances with buying links.",
  openGraph: {
    title: "Best Perfumes — Curated Collections",
    description: "Discover the best perfumes for every occasion, budget, and style.",
  },
};

const amazonTag = process.env.NEXT_PUBLIC_AMAZON_TAG ?? "perfumare-20";

interface Collection {
  title: string;
  slug: string;
  description: string;
  icon: typeof Trophy;
  filter: Record<string, unknown>;
}

const collections: Collection[] = [
  {
    title: "Best Arabian Fragrances",
    slug: "arabian",
    description: "The finest oud, musk, and amber from Middle Eastern perfume houses",
    icon: Sparkles,
    filter: { brand: { category: "Arabian" } },
  },
  {
    title: "Best Niche Perfumes",
    slug: "niche",
    description: "Luxury niche fragrances that define modern perfumery",
    icon: Trophy,
    filter: { brand: { category: "Niche" } },
  },
  {
    title: "Best for Night Out",
    slug: "night",
    description: "Bold, seductive fragrances for evening occasions",
    icon: Moon,
    filter: { accords: { some: { accord: { name: { in: ["Sweet", "Warm Spicy", "Amber", "Oud"] } }, intensity: { gte: 70 } } } },
  },
  {
    title: "Best for Office & Daily Wear",
    slug: "office",
    description: "Clean, professional scents that won't overwhelm your coworkers",
    icon: Sun,
    filter: { accords: { some: { accord: { name: { in: ["Fresh", "Citrus", "Aquatic", "Green"] } }, intensity: { gte: 60 } } } },
  },
  {
    title: "Most Popular Overall",
    slug: "popular",
    description: "The most discussed and sought-after fragrances right now",
    icon: Flame,
    filter: {},
  },
];

export default async function BestPerfumesPage() {
  const results = await Promise.all(
    collections.map(async (col) => {
      const perfumes = await db.perfume.findMany({
        where: col.filter as any,
        take: 8,
        orderBy: { createdAt: "desc" },
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
      return { ...col, perfumes };
    })
  );

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center py-6">
        <p className="section-title mb-2">Curated Collections</p>
        <h1 className="text-3xl md:text-4xl font-serif text-bark-500 text-glow">
          Best Perfumes
        </h1>
        <p className="text-bark-300 mt-3 max-w-xl mx-auto">
          Expert-curated collections to help you find the perfect fragrance.
          Every perfume links directly to Amazon for easy purchasing.
        </p>
      </div>

      <ArabianDivider />

      {/* Collections */}
      {results.map((col) => {
        const Icon = col.icon;
        return (
          <section key={col.slug}>
            <div className="flex items-center gap-3 mb-2">
              <Icon size={22} className="text-gold-500" strokeWidth={1.5} />
              <h2 className="text-xl font-serif text-bark-500">{col.title}</h2>
            </div>
            <p className="text-sm text-cream-500 mb-6">{col.description}</p>

            {col.perfumes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {col.perfumes.map((p) => {
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
              <p className="text-sm text-cream-500">Coming soon</p>
            )}

            <ArabianDivider className="mt-8" />
          </section>
        );
      })}

      {/* Affiliate note */}
      <div className="text-center text-[10px] text-cream-600">
        <p>
          Product links on this page are affiliate links.{" "}
          <Link href="/affiliate-disclosure" className="text-gold-500/60 no-underline hover:text-gold-500">
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
}
