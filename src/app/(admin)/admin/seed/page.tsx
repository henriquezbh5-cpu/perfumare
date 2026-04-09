import { db } from "@/lib/db";

export default async function AdminSeedPage() {
  const counts = await Promise.all([
    db.perfume.count(),
    db.brand.count(),
    db.note.count(),
    db.perfumer.count(),
    db.accord.count(),
    db.forumCategory.count(),
  ]);

  const labels = ["Perfumes", "Brands", "Notes", "Perfumers", "Accords", "Forum Categories"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-bark-500 text-glow">Seed Data</h1>
        <p className="text-sm text-cream-600 mt-1">
          Database seed status. Run <code className="text-gold-500 bg-cream-200/20 px-1.5 py-0.5 rounded text-xs">npx prisma db seed</code> to populate.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {labels.map((label, i) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className={`text-3xl font-serif ${counts[i] > 0 ? "text-green-400" : "text-red-400"}`}>
              {counts[i]}
            </p>
            <p className="text-xs text-cream-600 uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-5">
        <h3 className="font-serif text-bark-400 mb-3">How to Seed</h3>
        <div className="text-sm text-bark-300 space-y-2">
          <p>1. Make sure your <code className="text-gold-500 bg-cream-200/20 px-1 rounded text-xs">DATABASE_URL</code> is set in <code className="text-gold-500 bg-cream-200/20 px-1 rounded text-xs">.env</code></p>
          <p>2. Run migrations: <code className="text-gold-500 bg-cream-200/20 px-1.5 py-0.5 rounded text-xs">npx prisma db push</code></p>
          <p>3. Seed data: <code className="text-gold-500 bg-cream-200/20 px-1.5 py-0.5 rounded text-xs">npx prisma db seed</code></p>
          <p>4. Seed data is in <code className="text-gold-500 bg-cream-200/20 px-1 rounded text-xs">scripts/seed-data/</code> (JSON files)</p>
        </div>
      </div>
    </div>
  );
}
