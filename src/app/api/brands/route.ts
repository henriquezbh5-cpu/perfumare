import { NextRequest } from "next/server";
import { db } from "@/lib/db";

// GET /api/brands?page=1&limit=20&category=Niche&q=search&sort=name
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50")));
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") ?? "name";
  const q = searchParams.get("q")?.trim();

  const where: Record<string, unknown> = {};

  if (category) where.category = category;
  if (q) where.name = { contains: q, mode: "insensitive" };

  const orderByMap: Record<string, Record<string, string>> = {
    name: { name: "asc" },
    newest: { createdAt: "desc" },
    country: { country: "asc" },
  };
  const orderBy = orderByMap[sort] ?? orderByMap.name;

  const [brands, total] = await Promise.all([
    db.brand.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { perfumes: true } },
      },
    }),
    db.brand.count({ where }),
  ]);

  return Response.json({
    brands: brands.map((b) => ({
      slug: b.slug,
      name: b.name,
      country: b.country,
      category: b.category,
      logoUrl: b.logoUrl,
      founded: b.founded,
      perfumeCount: b._count.perfumes,
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
