import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  const { slug } = await context.params;

  const perfume = await db.perfume.findUnique({
    where: { slug },
    include: {
      brand: { select: { name: true } },
      accords: {
        include: { accord: { select: { name: true, color: true } } },
        orderBy: { intensity: "desc" },
      },
      notes: {
        include: { note: { select: { name: true, slug: true } } },
      },
    },
  });

  if (!perfume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    slug: perfume.slug,
    name: perfume.name,
    brand: perfume.brand.name,
    year: perfume.year,
    gender: perfume.gender,
    concentration: perfume.concentration,
    imageUrl: perfume.imageUrl,
    description: perfume.description,
    accords: perfume.accords.map((a) => ({
      name: a.accord.name,
      color: a.accord.color,
      intensity: a.intensity,
    })),
    notes: perfume.notes.map((n) => ({
      name: n.note.name,
      layer: n.layer,
    })),
  });
}
