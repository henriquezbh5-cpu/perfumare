import { db } from "@/lib/db";

export default async function HomePage() {
  const [perfumeCount, brandCount, noteCount, perfumerCount] =
    await Promise.all([
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
    <div className="text-center py-12">
      <p className="section-title mb-3">Welcome to</p>
      <h1 className="text-4xl md:text-5xl font-serif text-bark-500 mb-4">
        1000PerfumesNight
      </h1>
      <div className="gold-divider mb-6" />
      <p className="text-bark-300 max-w-xl mx-auto mb-12">
        The ultimate fragrance encyclopedia. Discover, compare, and review
        thousands of perfumes from around the world.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-cream-300 rounded-lg p-6 shadow-card"
          >
            <div className="text-3xl mb-2">{stat.emoji}</div>
            <div className="text-2xl font-serif text-bark-500 mb-1">
              {stat.count}
            </div>
            <div className="text-xs uppercase tracking-widest text-cream-500">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
