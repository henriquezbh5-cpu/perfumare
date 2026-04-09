import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { PerfumeImageManager } from "./image-manager";

export default async function AdminPerfumesPage() {
  const perfumes = await db.perfume.findMany({
    orderBy: { name: "asc" },
    include: {
      brand: { select: { name: true } },
      _count: { select: { reviews: true, votes: true } },
    },
  });

  const withImage = perfumes.filter((p) => p.imageUrl).length;
  const withoutImage = perfumes.length - withImage;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-bark-500 text-glow">Perfumes</h1>
        <div className="flex gap-4 text-sm">
          <span className="text-emerald-400">{withImage} with image</span>
          <span className="text-amber-400">{withoutImage} missing</span>
          <span className="text-cream-600">{perfumes.length} total</span>
        </div>
      </div>

      <PerfumeImageManager
        perfumes={perfumes.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          brand: p.brand.name,
          gender: p.gender,
          year: p.year,
          concentration: p.concentration,
          imageUrl: p.imageUrl,
          reviewCount: p._count.reviews,
        }))}
      />
    </div>
  );
}
