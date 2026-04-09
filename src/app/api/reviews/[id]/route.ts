import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";

type Context = { params: Promise<{ id: string }> };

// GET /api/reviews/[id]
export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;

  const review = await db.review.findUnique({
    where: { id, deletedAt: null },
    include: {
      user: { select: { id: true, username: true, name: true, image: true } },
      perfume: { select: { slug: true, name: true, brand: { select: { name: true } } } },
    },
  });

  if (!review) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(review);
}

// PUT /api/reviews/[id] — update own review
export async function PUT(request: NextRequest, context: Context) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const review = await db.review.findUnique({ where: { id, deletedAt: null } });

  if (!review) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (review.userId !== session.user.id && session.user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, body: reviewBody, rating } = body;

  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return Response.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  const updated = await db.review.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(reviewBody !== undefined && { body: reviewBody }),
      ...(rating !== undefined && { rating }),
    },
    include: {
      user: { select: { id: true, username: true, name: true, image: true } },
    },
  });

  return Response.json(updated);
}

// DELETE /api/reviews/[id] — soft delete
export async function DELETE(_request: NextRequest, context: Context) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const review = await db.review.findUnique({ where: { id, deletedAt: null } });

  if (!review) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (review.userId !== session.user.id && session.user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.review.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return Response.json({ success: true });
}
