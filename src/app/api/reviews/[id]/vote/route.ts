import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";

type Context = { params: Promise<{ id: string }> };

// POST /api/reviews/[id]/vote — vote helpful or notHelpful
export async function POST(request: NextRequest, context: Context) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: reviewId } = await context.params;
  const { type } = await request.json();

  if (!type || !["helpful", "notHelpful"].includes(type)) {
    return Response.json({ error: "Type must be 'helpful' or 'notHelpful'" }, { status: 400 });
  }

  // Check review exists
  const review = await db.review.findUnique({ where: { id: reviewId, deletedAt: null } });
  if (!review) {
    return Response.json({ error: "Review not found" }, { status: 404 });
  }

  // Can't vote on own review
  if (review.userId === session.user.id) {
    return Response.json({ error: "Cannot vote on your own review" }, { status: 400 });
  }

  // Upsert vote (allows changing vote)
  const existing = await db.reviewVote.findUnique({
    where: { userId_reviewId: { userId: session.user.id, reviewId } },
  });

  const oldType = existing?.type;

  await db.reviewVote.upsert({
    where: { userId_reviewId: { userId: session.user.id, reviewId } },
    create: { userId: session.user.id, reviewId, type },
    update: { type },
  });

  // Update counters on the review
  if (oldType !== type) {
    const increment: Record<string, number> = {};
    if (type === "helpful") increment.helpfulCount = 1;
    else increment.notHelpfulCount = 1;
    if (oldType === "helpful") increment.helpfulCount = (increment.helpfulCount ?? 0) - 1;
    if (oldType === "notHelpful") increment.notHelpfulCount = (increment.notHelpfulCount ?? 0) - 1;

    await db.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount: { increment: increment.helpfulCount ?? 0 },
        notHelpfulCount: { increment: increment.notHelpfulCount ?? 0 },
      },
    });
  }

  return Response.json({ success: true, type });
}
