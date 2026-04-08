import Link from "next/link";
import { db } from "@/lib/db";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

const familyIcons: Record<string, string> = {
  Woody: "\ud83e\udeb5",
  Floral: "\ud83c\udf39",
  Oriental: "\ud83d\udd4c",
  Fresh: "\ud83c\udf3f",
  Spicy: "\ud83d\udd25",
  Citrus: "\ud83c\udf4b",
  Gourmand: "\ud83c\udf6c",
  Aquatic: "\ud83d\udca7",
  Green: "\ud83c\udf31",
  Earthy: "\ud83e\udea8",
  Musky: "\u2728",
};

export default async function HomePage() {
  const [
    featuredPerfume,
    trendingPerfumes,
    noteFamilies,
    arabianBrands,
    perfumeCount,
    brandCount,
    noteCount,
    perfumerCount,
  ] = await Promise.all([
    // Fragrance of the Day — first perfume (admin-curated later)
    db.perfume.findFirst({
      orderBy: { createdAt: "asc" },
      include: {
        brand: true,
        accords: {
          include: { accord: true },
          orderBy: { intensity: "desc" },
          take: 4,
        },
      },
    }),
    // Trending — most recent 8
    db.perfume.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
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
    // Note families with count
    db.note.groupBy({
      by: ["family"],
      _count: { _all: true },
      orderBy: { family: "asc" },
    }),
    // Arabian brands
    db.brand.findMany({
      where: { category: "Arabian" },
      orderBy: { name: "asc" },
      include: { _count: { select: { perfumes: true } } },
    }),
    db.perfume.count(),
    db.brand.count(),
    db.note.count(),
    db.perfumer.count(),
  ]);

  const stats = [
    { label: "Perfumes", count: perfumeCount, emoji: "\ud83c\udf78" },
    { label: "Brands", count: brandCount, emoji: "\ud83c\udfe2" },
    { label: "Notes", count: noteCount, emoji: "\ud83c\udf3f" },
    { label: "Perfumers", count: perfumerCount, emoji: "\ud83e\uddd1\u200d\ud83c\udfa8" },
  ];

  return (
    <div className="space-y-16">
      {/* Hero / Welcome */}
      <section className="text-center py-4">
        <p className="section-title mb-3">Welcome to</p>
        <h1 className="text-4xl md:text-5xl font-serif text-bark-500 mb-4">
          1000PerfumesNight
        </h1>
        <div className="gold-divider mb-6" />
        <p className="text-bark-300 max-w-xl mx-auto">
          The ultimate fragrance encyclopedia. Discover, compare, and review
          thousands of perfumes from around the world.
        </p>
      </section>

      {/* Fragrance of the Day */}
      {featuredPerfume && (
        <section>
          <h2 className="section-title mb-6 text-center">
            Fragrance of the Day
          </h2>
          <Link
            href={`/perfumes/${featuredPerfume.slug}`}
            className="no-underline"
          >
            <Card hover className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-[3/4] bg-cream-100 rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex items-center justify-center overflow-hidden">
                  {featuredPerfume.imageUrl ? (
                    <img
                      src={featuredPerfume.imageUrl}
                      alt={featuredPerfume.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-7xl opacity-40">&#127798;</span>
                  )}
                </div>
                <CardBody className="flex flex-col justify-center gap-3">
                  <p className="section-title">
                    {featuredPerfume.brand.name}
                  </p>
                  <h3 className="text-2xl font-serif text-bark-500">
                    {featuredPerfume.name}
                  </h3>
                  <Badge className="w-fit">
                    {featuredPerfume.concentration}
                  </Badge>
                  {featuredPerfume.accords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {featuredPerfume.accords.map((a) => (
                        <span
                          key={a.accord.name}
                          className="text-xs px-2 py-0.5 rounded-full border"
                          style={{
                            borderColor: a.accord.color,
                            color: a.accord.color,
                          }}
                        >
                          {a.accord.name}
                        </span>
                      ))}
                    </div>
                  )}
                </CardBody>
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Trending Now */}
      {trendingPerfumes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Trending Now</h2>
            <Link
              href="/perfumes?sort=newest"
              className="text-sm text-gold-500 no-underline hover:text-gold-600"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingPerfumes.map((p) => {
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
        </section>
      )}

      {/* Browse by Note Family */}
      {noteFamilies.length > 0 && (
        <section>
          <h2 className="section-title mb-6 text-center">
            Browse by Note Family
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {noteFamilies.map((nf) => (
              <Link
                key={nf.family}
                href={`/notes?family=${encodeURIComponent(nf.family)}`}
                className="no-underline"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-cream-300 rounded-full hover:shadow-card-hover transition-shadow cursor-pointer">
                  <span className="text-lg">
                    {familyIcons[nf.family] ?? "\ud83c\udf3f"}
                  </span>
                  <span className="text-sm font-medium text-bark-400">
                    {nf.family}
                  </span>
                  <span className="text-xs text-cream-500">
                    ({nf._count._all})
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Arabian Houses */}
      {arabianBrands.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Featured Arabian Houses</h2>
            <Link
              href="/brands"
              className="text-sm text-gold-500 no-underline hover:text-gold-600"
            >
              All brands &rarr;
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {arabianBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="no-underline shrink-0"
              >
                <Card hover className="w-44">
                  <CardBody className="text-center">
                    <div className="w-14 h-14 rounded-full bg-bark-500 text-gold-400 flex items-center justify-center text-lg font-serif mx-auto mb-3">
                      {getInitials(brand.name)}
                    </div>
                    <h3 className="font-serif text-bark-500 text-sm mb-1 truncate">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-cream-500">
                      {brand._count.perfumes}{" "}
                      {brand._count.perfumes === 1 ? "perfume" : "perfumes"}
                    </p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      <section>
        <h2 className="section-title mb-6 text-center">Our Collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardBody className="text-center">
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className="text-2xl font-serif text-bark-500 mb-1">
                  {stat.count}
                </div>
                <div className="text-xs uppercase tracking-widest text-cream-500">
                  {stat.label}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
