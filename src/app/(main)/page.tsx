import Link from "next/link";
import { db } from "@/lib/db";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PerfumeBottleSvg } from "@/components/ui/perfume-bottle-svg";
import { getInitials } from "@/lib/utils";
import {
  Droplets,
  Building2,
  Leaf,
  Palette,
  Star,
  MessageSquare,
  Search,
} from "lucide-react";

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
    newArrivals,
    noteFamilies,
    arabianBrands,
    perfumeCount,
    brandCount,
    noteCount,
    perfumerCount,
    topPerfumers,
  ] = await Promise.all([
    // Fragrance of the Day
    db.perfume.findFirst({
      orderBy: { createdAt: "asc" },
      include: {
        brand: true,
        perfumer: true,
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
    // New Arrivals — latest 4
    db.perfume.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
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
    // Top 4 perfumers by creation count
    db.perfumer.findMany({
      take: 4,
      orderBy: { perfumes: { _count: "desc" } },
      include: { _count: { select: { perfumes: true } } },
    }),
  ]);

  const statsData = [
    { label: "Perfumes", count: perfumeCount, icon: Droplets },
    { label: "Brands", count: brandCount, icon: Building2 },
    { label: "Notes", count: noteCount, icon: Leaf },
    { label: "Perfumers", count: perfumerCount, icon: Palette },
  ];

  const featuredAccordColor =
    featuredPerfume?.accords?.[0]?.accord?.color ?? "#c9a962";

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative -mx-4 -mt-8 px-4 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #2c1810 0%, #5a4a3a 40%, #8b6914 70%, #c9a962 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_50%)]" />
        <div className="relative z-10 py-16 md:py-24 text-center max-w-3xl mx-auto">
          <p className="text-xs tracking-[4px] uppercase text-gold-400 mb-4">
            The Fragrance Encyclopedia
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
            Discover Your
            <br />
            <span className="text-gold-400">Signature Scent</span>
          </h1>
          <div className="w-16 h-px mx-auto mb-6 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          <p className="text-cream-300 text-lg md:text-xl mb-8 max-w-xl mx-auto leading-relaxed">
            Explore thousands of perfumes, read expert reviews, and find the
            fragrance that defines you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/perfumes"
              className="no-underline inline-flex items-center gap-2 bg-gold-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-600 transition-colors"
            >
              <Search size={18} />
              Browse Perfumes
            </Link>
            <Link
              href="/finder"
              className="no-underline inline-flex items-center gap-2 border border-gold-400/50 text-gold-400 px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Find Your Match
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {statsData.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.label}>
                <CardBody className="text-center py-5">
                  <IconComponent
                    size={28}
                    className="mx-auto mb-2 text-gold-500"
                    strokeWidth={1.5}
                  />
                  <div className="text-2xl font-serif text-bark-500 mb-1">
                    {stat.count.toLocaleString()}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-cream-500">
                    {stat.label}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Fragrance of the Day */}
      {featuredPerfume && (
        <section>
          <h2 className="section-title mb-2 text-center">
            Fragrance of the Day
          </h2>
          <p className="text-sm text-cream-500 text-center mb-6">
            Our daily pick for you
          </p>
          <Link
            href={`/perfumes/${featuredPerfume.slug}`}
            className="no-underline group"
          >
            <div className="max-w-3xl mx-auto rounded-xl overflow-hidden border border-cream-300 shadow-card hover:shadow-card-hover transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div
                  className="aspect-[3/4] md:aspect-auto flex items-center justify-center overflow-hidden relative"
                  style={{
                    background: featuredPerfume.imageUrl
                      ? undefined
                      : `linear-gradient(135deg, ${featuredAccordColor}18, ${featuredAccordColor}08, #f5f0e8)`,
                  }}
                >
                  {featuredPerfume.imageUrl ? (
                    <img
                      src={featuredPerfume.imageUrl}
                      alt={featuredPerfume.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="py-12">
                      <PerfumeBottleSvg
                        color={featuredAccordColor}
                        size="lg"
                      />
                    </div>
                  )}
                </div>
                <div className="bg-white p-8 flex flex-col justify-center gap-4">
                  <div>
                    <p className="section-title mb-1">
                      {featuredPerfume.brand.name}
                    </p>
                    <h3 className="text-3xl font-serif text-bark-500 group-hover:text-gold-600 transition-colors">
                      {featuredPerfume.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{featuredPerfume.concentration}</Badge>
                    <Badge>{featuredPerfume.gender}</Badge>
                    {featuredPerfume.year && (
                      <span className="text-sm text-cream-500">
                        {featuredPerfume.year}
                      </span>
                    )}
                  </div>
                  {featuredPerfume.perfumer && (
                    <p className="text-sm text-bark-300">
                      By {featuredPerfume.perfumer.name}
                    </p>
                  )}
                  {featuredPerfume.accords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {featuredPerfume.accords.map((a) => (
                        <span
                          key={a.accord.name}
                          className="text-xs px-3 py-1 rounded-full border font-medium"
                          style={{
                            borderColor: a.accord.color,
                            color: a.accord.color,
                            backgroundColor: `${a.accord.color}10`,
                          }}
                        >
                          {a.accord.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="text-sm text-gold-500 font-medium group-hover:text-gold-600 transition-colors mt-2">
                    Explore this fragrance &rarr;
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">New Arrivals</h2>
              <p className="text-sm text-cream-500 mt-1">
                Recently added to our collection
              </p>
            </div>
            <Link
              href="/perfumes?sort=newest"
              className="text-sm text-gold-500 no-underline hover:text-gold-600 font-medium"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newArrivals.map((p) => {
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

      {/* Trending Now */}
      {trendingPerfumes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Trending Now</h2>
              <p className="text-sm text-cream-500 mt-1">
                Most popular this week
              </p>
            </div>
            <Link
              href="/perfumes?sort=newest"
              className="text-sm text-gold-500 no-underline hover:text-gold-600 font-medium"
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
          <h2 className="section-title mb-2 text-center">
            Browse by Note Family
          </h2>
          <p className="text-sm text-cream-500 text-center mb-6">
            Explore fragrances by scent profile
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {noteFamilies.map((nf) => (
              <Link
                key={nf.family}
                href={`/notes?family=${encodeURIComponent(nf.family)}`}
                className="no-underline"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-cream-300 rounded-full hover:shadow-card-hover hover:border-gold-300 transition-all duration-200 cursor-pointer group">
                  <span className="text-lg">
                    {familyIcons[nf.family] ?? "\ud83c\udf3f"}
                  </span>
                  <span className="text-sm font-medium text-bark-400 group-hover:text-gold-600 transition-colors">
                    {nf.family}
                  </span>
                  <span className="text-xs text-cream-500 bg-cream-100 px-1.5 py-0.5 rounded-full">
                    {nf._count._all}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular Perfumers */}
      {topPerfumers.length > 0 && (
        <section>
          <h2 className="section-title mb-2 text-center">
            Popular Perfumers
          </h2>
          <p className="text-sm text-cream-500 text-center mb-6">
            The noses behind your favorite scents
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {topPerfumers.map((perfumer) => (
              <Link
                key={perfumer.id}
                href={`/perfumers/${perfumer.slug}`}
                className="no-underline group"
              >
                <Card hover>
                  <CardBody className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-bark-500 to-bark-400 text-gold-400 flex items-center justify-center text-lg font-serif mx-auto mb-3 group-hover:from-gold-500 group-hover:to-gold-600 group-hover:text-white transition-all duration-300">
                      {getInitials(perfumer.name)}
                    </div>
                    <h3 className="font-serif text-bark-500 text-sm mb-1 truncate group-hover:text-gold-600 transition-colors">
                      {perfumer.name}
                    </h3>
                    <p className="text-xs text-cream-500">
                      {perfumer._count.perfumes}{" "}
                      {perfumer._count.perfumes === 1
                        ? "creation"
                        : "creations"}
                    </p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Arabian Houses */}
      {arabianBrands.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Featured Arabian Houses</h2>
              <p className="text-sm text-cream-500 mt-1">
                Premium oriental fragrance houses
              </p>
            </div>
            <Link
              href="/brands"
              className="text-sm text-gold-500 no-underline hover:text-gold-600 font-medium"
            >
              All brands &rarr;
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {arabianBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="no-underline shrink-0 group"
              >
                <Card hover className="w-44">
                  <CardBody className="text-center">
                    <div className="w-14 h-14 rounded-full bg-bark-500 text-gold-400 flex items-center justify-center text-lg font-serif mx-auto mb-3 group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300">
                      {getInitials(brand.name)}
                    </div>
                    <h3 className="font-serif text-bark-500 text-sm mb-1 truncate group-hover:text-gold-600 transition-colors">
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

      {/* Latest Reviews */}
      <section>
        <h2 className="section-title mb-2 text-center">Latest Reviews</h2>
        <p className="text-sm text-cream-500 text-center mb-6">
          What the community is saying
        </p>
        <Card>
          <CardBody className="text-center py-12">
            <MessageSquare
              size={40}
              className="mx-auto mb-4 text-cream-400"
              strokeWidth={1.2}
            />
            <p className="text-cream-500 mb-2 text-lg font-serif">
              Coming soon
            </p>
            <p className="text-sm text-cream-500">
              Be the first to review a fragrance and share your experience with
              the community!
            </p>
            <Link
              href="/perfumes"
              className="no-underline inline-block mt-4 text-sm text-gold-500 font-medium hover:text-gold-600 transition-colors"
            >
              Browse perfumes to review &rarr;
            </Link>
          </CardBody>
        </Card>
      </section>

      {/* Top Rated placeholder */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Top Rated</h2>
            <p className="text-sm text-cream-500 mt-1">
              Highest rated by the community
            </p>
          </div>
          <Link
            href="/perfumes?sort=rating"
            className="text-sm text-gold-500 no-underline hover:text-gold-600 font-medium"
          >
            View all &rarr;
          </Link>
        </div>
        <Card>
          <CardBody className="text-center py-12">
            <Star
              size={40}
              className="mx-auto mb-4 text-cream-400"
              strokeWidth={1.2}
            />
            <p className="text-cream-500 mb-2 text-lg font-serif">
              Ratings coming soon
            </p>
            <p className="text-sm text-cream-500">
              Once our community starts rating fragrances, the top picks will
              appear here.
            </p>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
