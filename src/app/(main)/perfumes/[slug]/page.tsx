import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getInitials } from "@/lib/utils";
import { TransparentImage } from "@/components/ui/transparent-image";
import { AccordBars } from "@/components/perfume/accord-bars";
import { NotesPyramid } from "@/components/perfume/notes-pyramid";
import { WhereToBuy } from "@/components/perfume/where-to-buy";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import {
  PerfumeWardrobeSection,
  PerfumeReviewButton,
  PerfumeReviewSectionButton,
  PerfumePerformanceSection,
} from "@/components/perfume/perfume-interactions";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { PerfumeBottleSvg } from "@/components/ui/perfume-bottle-svg";
import { Star } from "lucide-react";
import { ArabianDivider, ArabianCorner } from "@/components/ui/arabian-patterns";
import { RatingHistogram } from "@/components/perfume/rating-histogram";
import { VotableNotes } from "@/components/perfume/votable-notes";
import { ShareButtons } from "@/components/ui/share-buttons";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const perfume = await getPerfume(slug);

  if (!perfume) {
    return { title: "Perfume Not Found" };
  }

  const description = perfume.description ??
    `Discover ${perfume.name} by ${perfume.brand.name}. Read reviews, see notes, accords and performance data.`;

  return {
    title: `${perfume.name} by ${perfume.brand.name}`,
    description,
    openGraph: {
      title: `${perfume.name} by ${perfume.brand.name}`,
      description,
      type: "website",
      ...(perfume.imageUrl ? { images: [{ url: perfume.imageUrl, width: 400, height: 500 }] } : {}),
    },
    twitter: {
      card: "summary",
      title: `${perfume.name} by ${perfume.brand.name}`,
      description,
    },
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

  const avgRating =
    perfume.reviews.length > 0
      ? perfume.reviews.reduce((sum, r) => sum + r.rating, 0) /
        perfume.reviews.length
      : 0;

  const topNotes = perfume.notes
    .filter((n) => n.layer === "top")
    .map((n) => ({ name: n.note.name, slug: n.note.slug }));
  const heartNotes = perfume.notes
    .filter((n) => n.layer === "middle")
    .map((n) => ({ name: n.note.name, slug: n.note.slug }));
  const baseNotes = perfume.notes
    .filter((n) => n.layer === "base")
    .map((n) => ({ name: n.note.name, slug: n.note.slug }));

  const accords = perfume.accords.map((a) => ({
    name: a.accord.name,
    color: a.accord.color,
    intensity: a.intensity,
  }));

  const affiliateLinks = perfume.affiliateLinks.length > 0
    ? perfume.affiliateLinks.map((l) => ({
        retailer: l.retailer,
        url: l.url,
        price: l.price?.toString() ?? null,
        currency: l.currency,
      }))
    : [
        {
          retailer: "Amazon",
          url: `https://www.amazon.com/s?k=${encodeURIComponent(`${perfume.brand.name} ${perfume.name} ${perfume.concentration}`)}&tag=${process.env.NEXT_PUBLIC_AMAZON_TAG ?? "perfumare-20"}`,
          price: null,
          currency: "USD",
        },
      ];

  const mainAccordColor =
    perfume.accords.sort((a, b) => b.intensity - a.intensity)[0]?.accord
      ?.color ?? "#c9a962";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${perfume.name} by ${perfume.brand.name}`,
    description: perfume.description ?? undefined,
    brand: { "@type": "Brand", name: perfume.brand.name },
    ...(perfume.imageUrl ? { image: perfume.imageUrl } : {}),
    ...(perfume.reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: perfume.reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="text-sm text-cream-500">
        <Link
          href="/"
          className="hover:text-gold-500 no-underline text-cream-500 transition-colors"
        >
          Home
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <Link
          href="/perfumes"
          className="hover:text-gold-500 no-underline text-cream-500 transition-colors"
        >
          Perfumes
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <Link
          href={`/brands/${perfume.brand.slug}`}
          className="hover:text-gold-500 no-underline text-cream-500 transition-colors"
        >
          {perfume.brand.name}
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-bark-400">{perfume.name}</span>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {/* Image — transparent bg via canvas proxy */}
          <div className="aspect-[3/4] rounded-xl flex items-center justify-center relative group/img">
            {/* Subtle glow behind */}
            <div
              className="absolute inset-0 opacity-30 group-hover/img:opacity-50 transition-opacity duration-1000 blur-2xl"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${mainAccordColor}30, transparent 60%)`,
              }}
            />

            {perfume.imageUrl && perfume.imageUrl.startsWith("http") ? (
              <TransparentImage
                src={perfume.imageUrl}
                alt={perfume.name}
                className="relative z-10 w-full h-full object-contain p-6 transition-all duration-700 ease-out group-hover/img:scale-105 group-hover/img:-translate-y-2"
              />
            ) : (
              <div className="relative z-10 transition-all duration-500 group-hover/img:scale-105 group-hover/img:-translate-y-2">
                <PerfumeBottleSvg color={mainAccordColor} size="lg" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Link
                href={`/brands/${perfume.brand.slug}`}
                className="section-title no-underline hover:text-gold-600 transition-colors"
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
                  className="text-gold-500 no-underline hover:text-gold-600 font-medium transition-colors"
                >
                  {perfume.perfumer.name}
                </Link>
              </p>
            )}

            {/* Wardrobe + Share */}
            <div className="flex items-center justify-between">
              <PerfumeWardrobeSection perfumeId={perfume.id} />
              <ShareButtons title={`${perfume.name} by ${perfume.brand.name}`} />
            </div>

            {/* Rating summary — more prominent */}
            <div
              className="rounded-xl p-6 border"
              style={{
                background: `linear-gradient(135deg, ${mainAccordColor}08, rgba(15,15,24,0.5))`,
                borderColor: `${mainAccordColor}15`,
              }}
            >
              <div className="flex items-center gap-6">
                <div className="text-center shrink-0">
                  <div className="text-5xl font-serif text-bark-500 mb-1">
                    {perfume.reviews.length > 0
                      ? avgRating.toFixed(1)
                      : "\u2014"}
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
                </div>
                {perfume.reviews.length > 0 ? (
                  <div className="flex-1 border-l border-cream-200/20 pl-6">
                    <RatingHistogram reviews={perfume.reviews} />
                  </div>
                ) : (
                  <div className="flex-1 border-l border-cream-200/20 pl-6">
                    <p className="text-sm text-bark-300 mb-3">
                      Share your experience
                    </p>
                    <PerfumeReviewButton
                      perfumeId={perfume.id}
                      perfumeName={perfume.name}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
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

      <ArabianDivider />

      {/* Notes — Votable */}
      {perfume.notes.length > 0 && (
        <VotableNotes
          perfumeId={perfume.id}
          notes={perfume.notes.map((n) => ({
            name: n.note.name,
            slug: n.note.slug,
            layer: n.layer,
            voteCount: n.voteCount,
            noteId: n.noteId,
          }))}
        />
      )}

      <ArabianDivider />

      {/* Performance + Season/Time (live from API) */}
      <section>
        <PerfumePerformanceSection
          perfumeId={perfume.id}
          perfumeName={perfume.name}
        />
      </section>

      {/* Where to Buy */}
      <WhereToBuy links={affiliateLinks} />

      <ArabianDivider />

      {/* Reviews Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="section-title">
            Reviews ({perfume._count.reviews})
          </h3>
          <PerfumeReviewSectionButton
            perfumeId={perfume.id}
            perfumeName={perfume.name}
          />
        </div>

        {perfume.reviews.length > 0 ? (
          <div className="space-y-4">
            {perfume.reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-card-hover transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-bark-400">
                        {review.user.name ??
                          review.user.username ??
                          "Anonymous"}
                      </p>
                      <p className="text-xs text-cream-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
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
          <div className="text-center py-6 rounded-xl border border-cream-300/10 bg-cream-100/5">
            <Star
              size={24}
              className="mx-auto mb-2 text-cream-400"
              strokeWidth={1.2}
            />
            <p className="text-sm text-cream-500">
              No reviews yet — be the first to share your experience
            </p>
          </div>
        )}
      </section>

      {/* Inspired By / Dupe info */}
      {perfume.inspiredBy && (
        <section>
          <h3 className="section-title mb-3">Inspired By</h3>
          <div className="rounded-xl border border-cream-300/10 bg-cream-100/5 p-4 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm text-bark-300">
                This fragrance is commonly compared to <strong className="text-bark-400">{perfume.inspiredBy}</strong>.
                Many enthusiasts consider it an excellent alternative at a more accessible price point.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Similar Perfumes */}
      {similarPerfumes.length > 0 && (
        <section>
          <h3 className="section-title mb-2">Similar Perfumes</h3>
          <p className="text-sm text-cream-500 mb-6">
            People who like this also like...
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {similarPerfumes.map((p) => {
              const pRating = 0;
              const topAccords = p.accords
                .sort((a, b) => b.intensity - a.intensity)
                .slice(0, 3)
                .map((a) => ({ name: a.accord.name, color: a.accord.color }));

              return (
                <div
                  key={p.id}
                  className="shrink-0 w-40 md:w-48 snap-start"
                >
                  <PerfumeCard
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
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
