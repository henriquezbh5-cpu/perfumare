import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import { Badge } from "@/components/ui/badge";

export const revalidate = 86400;

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

type Props = {
  params: Promise<{ slug: string }>;
};

async function getNote(slug: string) {
  return db.note.findUnique({
    where: { slug },
    include: {
      perfumes: {
        include: {
          perfume: {
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
        },
      },
    },
  });
}

export async function generateStaticParams() {
  const notes = await db.note.findMany({ select: { slug: true } });
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);

  if (!note) {
    return { title: "Note Not Found" };
  }

  return {
    title: `${note.name} Note | 1000PerfumesNight`,
    description:
      note.description ??
      `Discover perfumes featuring ${note.name}, a ${note.family.toLowerCase()} note.`,
  };
}

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const note = await getNote(slug);

  if (!note) {
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
        <Link href="/notes" className="hover:text-gold-500 no-underline text-cream-500">
          Notes
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-bark-400">{note.name}</span>
      </nav>

      {/* Header */}
      <div className="text-center">
        <span className="text-4xl mb-3 block">
          {familyIcons[note.family] ?? "\ud83c\udf3f"}
        </span>
        <Badge className="mb-3">{note.family}</Badge>
        <h1 className="text-3xl font-serif text-bark-500 mb-2">{note.name}</h1>
        <p className="text-sm text-cream-500">
          Found in {note.perfumes.length}{" "}
          {note.perfumes.length === 1 ? "perfume" : "perfumes"}
        </p>
      </div>

      {/* Description */}
      {note.description && (
        <p className="text-bark-300 leading-relaxed max-w-2xl mx-auto text-center">
          {note.description}
        </p>
      )}

      {/* Perfumes Grid */}
      {note.perfumes.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {note.perfumes.map(({ perfume: p }) => {
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
          No perfumes listed with this note yet.
        </p>
      )}
    </div>
  );
}
