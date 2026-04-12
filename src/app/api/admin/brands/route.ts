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
  const { name, country, description, logoUrl, websiteUrl, founded, category } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = slugify(name);

  const brand = await db.brand.create({
    data: {
      slug,
      name,
      country: country || null,
      description: description || null,
      logoUrl: logoUrl || null,
      websiteUrl: websiteUrl || null,
      founded: founded ? parseInt(founded) : null,
      category: category || "Designer",
    },
  });

  return NextResponse.json(brand, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, name, country, description, logoUrl, websiteUrl, founded, category } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const brand = await db.brand.update({
    where: { id },
    data: {
      ...(name ? { name, slug: slugify(name) } : {}),
      country: country ?? undefined,
      description: description ?? undefined,
      logoUrl: logoUrl ?? undefined,
      websiteUrl: websiteUrl ?? undefined,
      founded: founded ? parseInt(founded) : undefined,
      category: category ?? undefined,
    },
  });

  return NextResponse.json(brand);
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

  await db.brand.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
