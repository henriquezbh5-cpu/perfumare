import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";

// GET /api/forums — list categories with thread counts, or threads for a category
export async function GET(request: NextRequest) {
  const categorySlug = request.nextUrl.searchParams.get("category");
  const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(request.nextUrl.searchParams.get("limit") ?? "20")));

  // If no category, return all categories with counts
  if (!categorySlug) {
    const categories = await db.forumCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { threads: true } },
      },
    });

    return Response.json({ categories });
  }

  // Return threads for a category
  const category = await db.forumCategory.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    return Response.json({ error: "Category not found" }, { status: 404 });
  }

  const [threads, total] = await Promise.all([
    db.forumThread.findMany({
      where: { categoryId: category.id },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, username: true, name: true, image: true } },
        _count: { select: { posts: true } },
      },
    }),
    db.forumThread.count({ where: { categoryId: category.id } }),
  ]);

  return Response.json({
    category,
    threads,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

// POST /api/forums — create a new thread
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { categoryId, title, body: firstPostBody } = body;

  if (!categoryId || !title || !firstPostBody) {
    return Response.json({ error: "categoryId, title, and body required" }, { status: 400 });
  }

  // Create thread + first post in a transaction
  const thread = await db.$transaction(async (tx) => {
    const newThread = await tx.forumThread.create({
      data: {
        categoryId,
        userId: session.user.id,
        title,
      },
    });

    await tx.forumPost.create({
      data: {
        threadId: newThread.id,
        userId: session.user.id,
        body: firstPostBody,
      },
    });

    return newThread;
  });

  return Response.json(thread, { status: 201 });
}
