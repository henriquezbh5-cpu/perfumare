"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ThumbsUp } from "lucide-react";

interface NoteItem {
  name: string;
  slug: string;
  layer: string;
  voteCount: number;
  noteId: string;
}

interface VotableNotesProps {
  perfumeId: string;
  notes: NoteItem[];
}

const layerConfig = {
  top: { label: "Top Notes", emoji: "🍊", color: "text-amber-400" },
  middle: { label: "Heart Notes", emoji: "❤️", color: "text-rose-400" },
  base: { label: "Base Notes", emoji: "🌲", color: "text-emerald-400" },
} as const;

export function VotableNotes({ perfumeId, notes }: VotableNotesProps) {
  const { data: session } = useSession();
  const [votedNotes, setVotedNotes] = useState<Set<string>>(new Set());
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(notes.map((n) => [n.noteId, n.voteCount]))
  );

  const handleVote = async (noteId: string) => {
    if (!session?.user) return;
    if (votedNotes.has(noteId)) return;

    setVotedNotes((prev) => new Set(prev).add(noteId));
    setCounts((prev) => ({ ...prev, [noteId]: (prev[noteId] ?? 0) + 1 }));

    try {
      await fetch("/api/votes/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfumeId, noteId }),
      });
    } catch {
      setVotedNotes((prev) => {
        const next = new Set(prev);
        next.delete(noteId);
        return next;
      });
      setCounts((prev) => ({ ...prev, [noteId]: (prev[noteId] ?? 1) - 1 }));
    }
  };

  const layers = (["top", "middle", "base"] as const).map((layer) => ({
    ...layerConfig[layer],
    key: layer,
    notes: notes.filter((n) => n.layer === layer),
  }));

  const maxVotes = Math.max(...Object.values(counts), 1);

  return (
    <section>
      <h3 className="section-title mb-2 text-center">Fragrance Notes</h3>
      <p className="text-xs text-cream-600 text-center mb-6">
        {session ? "Click a note if you detect it" : "Sign in to vote on notes you detect"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {layers.map(({ key, label, emoji, color, notes: layerNotes }) => (
          <div key={key} className="space-y-3">
            <div className="text-center">
              <span className="text-lg">{emoji}</span>
              <h4 className={`text-xs font-medium uppercase tracking-widest ${color} mt-1`}>
                {label}
              </h4>
            </div>
            <div className="space-y-1.5">
              {layerNotes.map((note) => {
                const count = counts[note.noteId] ?? 0;
                const pct = maxVotes > 0 ? (count / maxVotes) * 100 : 0;
                const voted = votedNotes.has(note.noteId);

                return (
                  <div key={note.noteId} className="flex items-center gap-2 group">
                    <Link
                      href={`/notes/${note.slug}`}
                      className="text-sm text-bark-300 no-underline hover:text-gold-500 transition-colors w-24 truncate shrink-0"
                    >
                      {note.name}
                    </Link>
                    <div className="flex-1 h-2 bg-cream-200/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-500/60 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <button
                      onClick={() => handleVote(note.noteId)}
                      disabled={!session || voted}
                      className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded transition-colors shrink-0 ${
                        voted
                          ? "text-gold-500 bg-gold-500/10"
                          : session
                            ? "text-cream-600 hover:text-gold-500 hover:bg-gold-500/10"
                            : "text-cream-600/50 cursor-default"
                      }`}
                      title={session ? (voted ? "Voted" : "I detect this note") : "Sign in to vote"}
                    >
                      <ThumbsUp size={10} />
                      <span>{count}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
