import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Fragrance Notes ",
  description:
    "Explore all fragrance notes organized by family. Discover woody, floral, oriental, fresh, spicy, citrus, gourmand and more.",
};

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

export default async function NotesPage() {
  const notes = await db.note.findMany({
    orderBy: [{ family: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { perfumes: true } },
    },
  });

  // Group notes by family
  const grouped = new Map<string, typeof notes>();
  for (const note of notes) {
    const family = note.family;
    if (!grouped.has(family)) {
      grouped.set(family, []);
    }
    grouped.get(family)!.push(note);
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif text-bark-500 mb-2">
          Fragrance Notes
        </h1>
        <p className="text-sm text-cream-500">
          {notes.length} notes across {grouped.size} families
        </p>
      </div>

      {Array.from(grouped.entries()).map(([family, familyNotes]) => (
        <section key={family}>
          <h2 className="text-lg font-serif text-bark-500 mb-4 flex items-center gap-2">
            <span className="text-2xl">
              {familyIcons[family] ?? "\ud83c\udf3f"}
            </span>
            {family}
            <span className="text-xs text-cream-500 font-sans font-normal">
              ({familyNotes.length})
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {familyNotes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.slug}`}
                className="no-underline"
              >
                <Badge className="hover:bg-gold-200 transition-colors cursor-pointer">
                  {note.name}
                  <span className="ml-1 text-cream-500 text-[10px]">
                    ({note._count.perfumes})
                  </span>
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
