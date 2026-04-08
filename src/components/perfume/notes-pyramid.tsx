import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface NoteItem {
  name: string;
  slug: string;
}

interface NotesPyramidProps {
  top: NoteItem[];
  heart: NoteItem[];
  base: NoteItem[];
}

function NoteColumn({
  title,
  emoji,
  notes,
}: {
  title: string;
  emoji: string;
  notes: NoteItem[];
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-2xl">{emoji}</div>
      <h4 className="text-xs font-medium uppercase tracking-widest text-cream-500">
        {title}
      </h4>
      <div className="flex flex-wrap justify-center gap-1.5">
        {notes.map((note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.slug}`}
            className="no-underline"
          >
            <Badge className="hover:bg-gold-200 transition-colors cursor-pointer">
              {note.name}
            </Badge>
          </Link>
        ))}
        {notes.length === 0 && (
          <span className="text-xs text-cream-500 italic">None listed</span>
        )}
      </div>
    </div>
  );
}

export function NotesPyramid({ top, heart, base }: NotesPyramidProps) {
  return (
    <section>
      <h3 className="section-title mb-6 text-center">Fragrance Notes</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <NoteColumn title="Top Notes" emoji="&#9728;&#65039;" notes={top} />
        <NoteColumn title="Heart Notes" emoji="&#10084;&#65039;" notes={heart} />
        <NoteColumn title="Base Notes" emoji="&#127795;" notes={base} />
      </div>
    </section>
  );
}
