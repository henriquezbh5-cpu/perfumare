import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";

const VALID_STATUS = ["have", "want", "had"];

// GET /api/wardrobe?userId=xxx&status=have
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  if (!userId) {
    return Response.json({ error: "userId required" }, { status: 400 });
  }

  const where: Record<string, unknown> = { userId };
  if (status && VALID_STATUS.includes(status)) where.status = status;

  const items = await db.wardrobe.findMany({
    where,
    orderBy: { addedAt: "desc" },
    include: {
      perfume: {
        select: {
          slug: true,
          name: true,
          imageUrl: true,
          gender: true,
          concentration: true,
          brand: { select: { name: true, slug: true } },
        },
      },
    },
  });

  return Response.json({ items });
}

// POST /api/wardrobe — add or update perfume in wardrobe
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { perfumeId, status, personalRating } = body;

  if (!perfumeId || !status) {
    return Response.json({ error: "perfumeId and status required" }, { status: 400 });
  }

  if (!VALID_STATUS.includes(status)) {
    return Response.json({ error: `status must be one of: ${VALID_STATUS.join(", ")}` }, { status: 400 });
  }

  if (personalRating !== undefined && (personalRating < 1 || personalRating > 5)) {
    return Response.json({ error: "personalRating must be 1-5" }, { status: 400 });
  }

  const item = await db.wardrobe.upsert({
    where: {
      userId_perfumeId: { userId: session.user.id, perfumeId },
    },
    create: {
      userId: session.user.id,
      perfumeId,
      status,
      personalRating: personalRating ?? null,
    },
    update: {
      status,
      ...(personalRating !== undefined && { personalRating }),
    },
  });

  return Response.json(item, { status: 201 });
}

// DELETE /api/wardrobe?perfumeId=xxx
export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const perfumeId = request.nextUrl.searchParams.get("perfumeId");
  if (!perfumeId) {
    return Response.json({ error: "perfumeId required" }, { status: 400 });
  }

  await db.wardrobe.deleteMany({
    where: { userId: session.user.id, perfumeId },
  });

  return Response.json({ success: true });
}
