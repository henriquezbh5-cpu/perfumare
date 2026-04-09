import { NextRequest } from "next/server";
import { db } from "@/lib/db";

// Occasion → note families mapping
const occasionFamilies: Record<string, string[]> = {
  daily: ["Fresh", "Citrus", "Green", "Aquatic"],
  special: ["Oriental", "Floral", "Gourmand"],
  night: ["Oriental", "Woody", "Spicy", "Musky"],
  work: ["Fresh", "Citrus", "Green", "Woody"],
};

// GET /api/search/finder?gender=male&families=Woody,Spicy&occasion=night
export async function GET(request: NextRequest) {
  const gender = request.nextUrl.searchParams.get("gender") ?? "";
  const familiesParam = request.nextUrl.searchParams.get("families") ?? request.nextUrl.searchParams.get("q") ?? "";
  const occasion = request.nextUrl.searchParams.get("occasion") ?? "";

  const where: Record<string, unknown> = {};

  if (gender) {
    where.gender = gender;
  }

  // Combine selected families + occasion families
  const selectedFamilies = familiesParam ? familiesParam.split(",").map((f) => f.trim()).filter(Boolean) : [];
  const occasionExtra = occasion && occasionFamilies[occasion] ? occasionFamilies[occasion] : [];

  const allFamilies = [...new Set([...selectedFamilies, ...occasionExtra])];

  if (allFamilies.length > 0) {
    where.notes = {
      some: {
        note: {
          family: { in: allFamilies, mode: "insensitive" },
        },
      },
    };
  }

  const results = await db.perfume.findMany({
    where,
    take: 12,
    orderBy: { createdAt: "desc" },
    include: {
      brand: { select: { name: true, slug: true } },
      accords: {
        include: { accord: { select: { name: true, color: true } } },
        orderBy: { intensity: "desc" },
        take: 3,
      },
      notes: {
        include: { note: { select: { name: true, family: true } } },
        take: 6,
      },
      _count: { select: { reviews: true, votes: true } },
    },
  });

  return Response.json({ results });
}
