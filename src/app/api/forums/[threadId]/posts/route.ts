import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";

type Context = { params: Promise<{ threadId: string }> };

// GET /api/forums/[threadId]/posts — list posts in a thread
export async function GET(request: NextRequest, context: Context) {
  const { threadId } = await context.params;
  const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(request.nextUrl.searchParams.get("limit") ?? "20")));

  const thread = await db.forumThread.findUnique({ where: { id: threadId } });
  if (!thread) {
    return Response.json({ error: "Thread not found" }, { status: 404 });
  }

  // Increment view count
  await db.forumThread.update({ where: { id: threadId }, data: { viewCount: { increment: 1 } } });

  const [posts, total] = await Promise.all([
    db.forumPost.findMany({
      where: { threadId, deletedAt: null },
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, username: true, name: true, image: true } },
        quotedPost: {
          select: {
            id: true,
            body: true,
            user: { select: { username: true, name: true } },
          },
        },
      },
    }),
    db.forumPost.count({ where: { threadId, deletedAt: null } }),
  ]);

  return Response.json({
    thread: {
      id: thread.id,
      title: thread.title,
      isPinned: thread.isPinned,
      isLocked: thread.isLocked,
      viewCount: thread.viewCount + 1,
    },
    posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

// POST /api/forums/[threadId]/posts — reply to a thread
export async function POST(request: NextRequest, context: Context) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await context.params;

  const thread = await db.forumThread.findUnique({ where: { id: threadId } });
  if (!thread) {
    return Response.json({ error: "Thread not found" }, { status: 404 });
  }

  if (thread.isLocked) {
    return Response.json({ error: "Thread is locked" }, { status: 403 });
  }

  const body = await request.json();
  const { body: postBody, quotedPostId } = body;

  if (!postBody) {
    return Response.json({ error: "body required" }, { status: 400 });
  }

  const post = await db.forumPost.create({
    data: {
      threadId,
      userId: session.user.id,
      body: postBody,
      quotedPostId: quotedPostId ?? null,
    },
    include: {
      user: { select: { id: true, username: true, name: true, image: true } },
    },
  });

  return Response.json(post, { status: 201 });
}
