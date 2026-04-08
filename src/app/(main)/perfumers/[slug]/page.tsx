import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getInitials } from "@/lib/utils";
import { PerfumeCard } from "@/components/perfume/perfume-card";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPerfumer(slug: string) {
  return db.perfumer.findUnique({
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const perfumer = await getPerfumer(slug);

  if (!perfumer) {
    return { title: "Perfumer Not Found" };
  }

  return {
    title: `${perfumer.name} - Perfumer | Perfumare`,
    description:
      perfumer.bio ??
      `Explore all ${perfumer._count.perfumes} creations by ${perfumer.name}.`,
  };
}

export default async function PerfumerDetailPage({ params }: Props) {
  const { slug } = await params;
  const perfumer = await getPerfumer(slug);

  if (!perfumer) {
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
        <Link href="/perfumers" className="hover:text-gold-500 no-underline text-cream-500">
          Perfumers
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-bark-400">{perfumer.name}</span>
      </nav>

      {/* Header */}
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-gold-100 border-2 border-gold-300 text-gold-500 flex items-center justify-center text-3xl font-serif mx-auto mb-4">
          {getInitials(perfumer.name)}
        </div>
        <h1 className="text-3xl font-serif text-bark-500 mb-1">
          {perfumer.name}
        </h1>
        {perfumer.nationality && (
          <p className="text-sm text-cream-500 mb-1">{perfumer.nationality}</p>
        )}
        <p className="text-sm text-cream-500">
          {perfumer._count.perfumes}{" "}
          {perfumer._count.perfumes === 1 ? "creation" : "creations"}
        </p>
      </div>

      {/* Bio */}
      {perfumer.bio && (
        <p className="text-bark-300 leading-relaxed max-w-2xl mx-auto text-center">
          {perfumer.bio}
        </p>
      )}

      {/* Perfumes Grid */}
      <section>
        <h2 className="section-title mb-6">Creations</h2>
        {perfumer.perfumes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {perfumer.perfumes.map((p) => {
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
            No perfumes listed yet for this perfumer.
          </p>
        )}
      </section>
    </div>
  );
}
