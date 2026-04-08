import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const [perfumes, brands, notes, perfumers] = await Promise.all([
    db.perfume.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { name: true, slug: true, brand: { select: { name: true } } },
      take: 5,
    }),
    db.brand.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { name: true, slug: true, country: true },
      take: 5,
    }),
    db.note.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { name: true, slug: true, family: true },
      take: 5,
    }),
    db.perfumer.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { name: true, slug: true, nationality: true },
      take: 5,
    }),
  ]);

  const results = [
    ...perfumes.map((p) => ({
      type: "Perfume" as const,
      name: p.name,
      slug: p.slug,
      extra: p.brand.name,
    })),
    ...brands.map((b) => ({
      type: "Brand" as const,
      name: b.name,
      slug: b.slug,
      extra: b.country ?? undefined,
    })),
    ...notes.map((n) => ({
      type: "Note" as const,
      name: n.name,
      slug: n.slug,
      extra: n.family,
    })),
    ...perfumers.map((p) => ({
      type: "Perfumer" as const,
      name: p.name,
      slug: p.slug,
      extra: p.nationality ?? undefined,
    })),
  ];

  return NextResponse.json({ results });
}
