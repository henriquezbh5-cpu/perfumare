import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, body: articleBody, excerpt, category, tags, featuredImage, publish } = body;

  if (!title || !articleBody || !category) {
    return NextResponse.json(
      { error: "Title, body, and category are required" },
      { status: 400 }
    );
  }

  const slug = slugify(title);

  const article = await db.article.create({
    data: {
      slug,
      title,
      body: articleBody,
      excerpt: excerpt || null,
      authorId: session.user.id,
      category,
      tags: tags ?? [],
      featuredImage: featuredImage || null,
      publishedAt: publish ? new Date() : null,
    },
  });

  return NextResponse.json(article, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, title, body: articleBody, excerpt, category, tags, featuredImage, publish } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const article = await db.article.update({
    where: { id },
    data: {
      ...(title ? { title, slug: slugify(title) } : {}),
      ...(articleBody ? { body: articleBody } : {}),
      excerpt: excerpt ?? undefined,
      category: category ?? undefined,
      tags: tags ?? undefined,
      featuredImage: featuredImage ?? undefined,
      ...(publish === true ? { publishedAt: new Date() } : {}),
      ...(publish === false ? { publishedAt: null } : {}),
    },
  });

  return NextResponse.json(article);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await db.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
