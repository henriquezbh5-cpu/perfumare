import { NextRequest } from "next/server";
import { db } from "@/lib/db";

// GET /api/perfumes?page=1&limit=20&gender=male&brand=xxx&concentration=EDP&sort=name&q=search
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const gender = searchParams.get("gender");
  const brandSlug = searchParams.get("brand");
  const concentration = searchParams.get("concentration");
  const noteFamily = searchParams.get("noteFamily");
  const yearFrom = searchParams.get("yearFrom");
  const yearTo = searchParams.get("yearTo");
  const sort = searchParams.get("sort") ?? "name";
  const q = searchParams.get("q")?.trim();

  const where: Record<string, unknown> = {};

  if (gender) where.gender = gender;
  if (concentration) where.concentration = concentration;
  if (brandSlug) where.brand = { slug: brandSlug };
  if (noteFamily) {
    where.notes = { some: { note: { family: { equals: noteFamily, mode: "insensitive" } } } };
  }
  if (yearFrom || yearTo) {
    where.year = {};
    if (yearFrom) (where.year as Record<string, unknown>).gte = parseInt(yearFrom);
    if (yearTo) (where.year as Record<string, unknown>).lte = parseInt(yearTo);
  }
  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }

  const orderByMap: Record<string, Record<string, string>> = {
    name: { name: "asc" },
    newest: { year: "desc" },
    oldest: { year: "asc" },
    recent: { createdAt: "desc" },
  };
  const orderBy = orderByMap[sort] ?? orderByMap.name;

  const [perfumes, total] = await Promise.all([
    db.perfume.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        brand: { select: { name: true, slug: true, category: true } },
        accords: {
          include: { accord: { select: { name: true, color: true } } },
          orderBy: { intensity: "desc" },
          take: 3,
        },
        _count: { select: { reviews: true, votes: true } },
      },
    }),
    db.perfume.count({ where }),
  ]);

  return Response.json({
    perfumes: perfumes.map((p) => ({
      slug: p.slug,
      name: p.name,
      gender: p.gender,
      year: p.year,
      concentration: p.concentration,
      imageUrl: p.imageUrl,
      brand: p.brand,
      accords: p.accords.map((a) => ({
        name: a.accord.name,
        color: a.accord.color,
        intensity: a.intensity,
      })),
      reviewCount: p._count.reviews,
      voteCount: p._count.votes,
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
