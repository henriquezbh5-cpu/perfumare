import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const gender = request.nextUrl.searchParams.get("gender") ?? "";
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  const where: Record<string, unknown> = {};

  if (gender) {
    where.gender = gender;
  }

  if (q) {
    where.notes = {
      some: {
        note: {
          family: { equals: q, mode: "insensitive" },
        },
      },
    };
  }

  const results = await db.perfume.findMany({
    where,
    take: 12,
    orderBy: { createdAt: "desc" },
    include: {
      brand: { select: { name: true } },
      accords: {
        include: { accord: { select: { name: true, color: true } } },
        orderBy: { intensity: "desc" },
        take: 3,
      },
      _count: { select: { reviews: true } },
    },
  });

  return NextResponse.json({ results });
}
