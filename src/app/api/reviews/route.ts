import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";

// GET /api/reviews?perfumeId=xxx&page=1&limit=10&sort=recent
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const perfumeId = searchParams.get("perfumeId");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10")));
  const sort = searchParams.get("sort") ?? "recent";

  const where: Record<string, unknown> = { deletedAt: null };
  if (perfumeId) where.perfumeId = perfumeId;

  const orderBy =
    sort === "helpful"
      ? { helpfulCount: "desc" as const }
      : sort === "rating"
        ? { rating: "desc" as const }
        : { createdAt: "desc" as const };

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, username: true, name: true, image: true } },
        perfume: { select: { slug: true, name: true } },
      },
    }),
    db.review.count({ where }),
  ]);

  return Response.json({
    reviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

// POST /api/reviews — create a new review
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { perfumeId, title, body: reviewBody, rating } = body;

  if (!perfumeId || !title || !reviewBody || !rating) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return Response.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  // Check if user already reviewed this perfume
  const existing = await db.review.findFirst({
    where: { userId: session.user.id, perfumeId, deletedAt: null },
  });

  if (existing) {
    return Response.json({ error: "You already reviewed this perfume" }, { status: 409 });
  }

  const review = await db.review.create({
    data: {
      userId: session.user.id,
      perfumeId,
      title,
      body: reviewBody,
      rating,
    },
    include: {
      user: { select: { id: true, username: true, name: true, image: true } },
    },
  });

  return Response.json(review, { status: 201 });
}
