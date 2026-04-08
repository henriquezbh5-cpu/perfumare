import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getInitials } from "@/lib/utils";
import { AccordBars } from "@/components/perfume/accord-bars";
import { NotesPyramid } from "@/components/perfume/notes-pyramid";
import { PerformanceVotes } from "@/components/perfume/performance-votes";
import { SeasonTime } from "@/components/perfume/season-time";
import { WhereToBuy } from "@/components/perfume/where-to-buy";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export const revalidate = 86400;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPerfume(slug: string) {
  return db.perfume.findUnique({
    where: { slug },
    include: {
      brand: true,
      perfumer: true,
      notes: {
        include: { note: true },
      },
      accords: {
        include: { accord: true },
      },
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      affiliateLinks: true,
      _count: {
        select: { reviews: true },
      },
    },
  });
}

async function getSimilarPerfumes(
  perfumeId: string,
  brandId: string,
  accordIds: string[]
) {
  return db.perfume.findMany({
    where: {
      id: { not: perfumeId },
      OR: [
        { brandId },
        ...(accordIds.length > 0
          ? [{ accords: { some: { accordId: { in: accordIds } } } }]
          : []),
      ],
    },
    include: {
      brand: true,
      accords: { include: { accord: true } },
      _count: { select: { reviews: true } },
    },
    take: 6,
  });
}

export async function generateStaticParams() {
  const perfumes = await db.perfume.findMany({
    select: { slug: true },
  });
  return perfumes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const perfume = await getPerfume(slug);

  if (!perfume) {
    return { title: "Perfume Not Found" };
  }

  return {
    title: `${perfume.name} by ${perfume.brand.name} | 1000PerfumesNight`,
    description:
      perfume.description ??
      `Discover ${perfume.name} by ${perfume.brand.name}. Read reviews, see notes, accords and performance data.`,
  };
}

export default async function PerfumeDetailPage({ params }: Props) {
  const { slug } = await params;
  const perfume = await getPerfume(slug);

  if (!perfume) {
    notFound();
  }

  const accordIds = perfume.accords.map((a) => a.accordId);
  const similarPerfumes = await getSimilarPerfumes(
    perfume.id,
    perfume.brandId,
    accordIds
  );

  // Compute average rating
  const avgRating =
    perfume.reviews.length > 0
      ? perfume.reviews.reduce((sum, r) => sum + r.rating, 0) /
        perfume.reviews.length
      : 0;

  // Organize notes by layer
  const topNotes = perfume.notes
    .filter((n) => n.layer === "top")
    .map((n) => ({ name: n.note.name, slug: n.note.slug }));
  const heartNotes = perfume.notes
    .filter((n) => n.layer === "middle")
    .map((n) => ({ name: n.note.name, slug: n.note.slug }));
  const baseNotes = perfume.notes
    .filter((n) => n.layer === "base")
    .map((n) => ({ name: n.note.name, slug: n.note.slug }));

  // Accords for AccordBars
  const accords = perfume.accords.map((a) => ({
    name: a.accord.name,
    color: a.accord.color,
    intensity: a.intensity,
  }));

  // Affiliate links
  const affiliateLinks = perfume.affiliateLinks.map((l) => ({
    retailer: l.retailer,
    url: l.url,
    price: l.price?.toString() ?? null,
    currency: l.currency,
  }));

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-cream-500">
        <Link href="/" className="hover:text-gold-500 no-underline text-cream-500">
          Home
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <Link href="/perfumes" className="hover:text-gold-500 no-underline text-cream-500">
          Perfumes
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <Link
          href={`/brands/${perfume.brand.slug}`}
          className="hover:text-gold-500 no-underline text-cream-500"
        >
          {perfume.brand.name}
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-bark-400">{perfume.name}</span>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-[3/4] bg-cream-100 rounded-lg flex items-center justify-center overflow-hidden">
          {perfume.imageUrl ? (
            <img
              src={perfume.imageUrl}
              alt={perfume.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl opacity-40">&#127798;</span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <Link
              href={`/brands/${perfume.brand.slug}`}
              className="section-title no-underline hover:text-gold-600"
            >
              {perfume.brand.name}
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-bark-500 mt-2">
              {perfume.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge>{perfume.concentration}</Badge>
              <Badge>{perfume.gender}</Badge>
              {perfume.year && (
                <span className="text-sm text-cream-500">{perfume.year}</span>
              )}
            </div>
          </div>

          {perfume.perfumer && (
            <p className="text-sm text-bark-300">
              Created by{" "}
              <Link
                href={`/perfumers/${perfume.perfumer.slug}`}
                className="text-gold-500 no-underline hover:text-gold-600"
              >
                {perfume.perfumer.name}
              </Link>
            </p>
          )}

          {/* Wardrobe buttons (visual only) */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Have
            </Button>
            <Button variant="outline" size="sm">
              Want
            </Button>
            <Button variant="ghost" size="sm">
              Had
            </Button>
          </div>

          {/* Rating summary */}
          <Card>
            <CardBody className="text-center">
              <div className="text-4xl font-serif text-bark-500 mb-2">
                {perfume.reviews.length > 0 ? avgRating.toFixed(1) : "\u2014"}
              </div>
              <Rating
                value={avgRating}
                size="lg"
                showValue={false}
                className="justify-center mb-1"
              />
              <p className="text-sm text-cream-500">
                {perfume._count.reviews}{" "}
                {perfume._count.reviews === 1 ? "review" : "reviews"}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Description */}
      {perfume.description && (
        <section>
          <h3 className="section-title mb-4">Description</h3>
          <p className="text-bark-300 leading-relaxed">{perfume.description}</p>
        </section>
      )}

      {/* Accords */}
      {accords.length > 0 && <AccordBars accords={accords} />}

      {/* Notes Pyramid */}
      <NotesPyramid top={topNotes} heart={heartNotes} base={baseNotes} />

      {/* Performance */}
      <PerformanceVotes
        longevity={7.5}
        sillage="Strong"
        priceValue={4.2}
      />

      {/* Season & Time */}
      <section>
        <h3 className="section-title mb-6 text-center">When to Wear</h3>
        <SeasonTime
          season={{ spring: 15, summer: 5, fall: 45, winter: 35 }}
          time={{ day: 25, night: 75 }}
        />
      </section>

      {/* Where to Buy */}
      <WhereToBuy links={affiliateLinks} />

      {/* Reviews Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="section-title">
            Reviews ({perfume._count.reviews})
          </h3>
          <Button size="sm">Write a Review</Button>
        </div>

        {perfume.reviews.length > 0 ? (
          <div className="space-y-4">
            {perfume.reviews.map((review) => (
              <Card key={review.id}>
                <CardBody>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-bark-400">
                        {review.user.name ?? review.user.username ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-cream-500">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Rating value={review.rating} size="sm" />
                  </div>
                  <h4 className="font-serif text-bark-500 mb-1">
                    {review.title}
                  </h4>
                  <p className="text-sm text-bark-300 leading-relaxed">
                    {review.body}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-cream-500">
                No reviews yet. Be the first to review this fragrance!
              </p>
            </CardBody>
          </Card>
        )}
      </section>

      {/* Similar Perfumes */}
      {similarPerfumes.length > 0 && (
        <section>
          <h3 className="section-title mb-6">Similar Perfumes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarPerfumes.map((p) => {
              const pRating = 0;
              const topAccords = p.accords
                .sort((a, b) => b.intensity - a.intensity)
                .slice(0, 3)
                .map((a) => ({ name: a.accord.name, color: a.accord.color }));

              return (
                <PerfumeCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  brand={p.brand.name}
                  year={p.year}
                  concentration={p.concentration}
                  imageUrl={p.imageUrl}
                  rating={pRating}
                  reviewCount={p._count.reviews}
                  topAccords={topAccords}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
