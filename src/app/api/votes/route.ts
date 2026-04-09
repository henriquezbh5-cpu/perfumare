import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";

const VALID_SILLAGE = ["intimate", "moderate", "strong", "enormous"];
const VALID_SEASON = ["spring", "summer", "fall", "winter"];
const VALID_TIME = ["day", "night"];

// GET /api/votes?perfumeId=xxx — get aggregated votes for a perfume
export async function GET(request: NextRequest) {
  const perfumeId = request.nextUrl.searchParams.get("perfumeId");
  if (!perfumeId) {
    return Response.json({ error: "perfumeId required" }, { status: 400 });
  }

  const votes = await db.perfumeVote.findMany({ where: { perfumeId } });

  if (votes.length === 0) {
    return Response.json({ totalVotes: 0, longevity: null, sillage: null, priceValue: null, season: null, timeOfDay: null });
  }

  // Aggregate longevity (average)
  const longevityVotes = votes.filter((v) => v.longevity !== null);
  const avgLongevity = longevityVotes.length
    ? longevityVotes.reduce((sum, v) => sum + v.longevity!, 0) / longevityVotes.length
    : null;

  // Aggregate sillage (mode)
  const sillageCounts: Record<string, number> = {};
  votes.forEach((v) => {
    if (v.sillage) sillageCounts[v.sillage] = (sillageCounts[v.sillage] ?? 0) + 1;
  });

  // Aggregate priceValue (average)
  const priceVotes = votes.filter((v) => v.priceValue !== null);
  const avgPrice = priceVotes.length
    ? priceVotes.reduce((sum, v) => sum + v.priceValue!, 0) / priceVotes.length
    : null;

  // Aggregate season (percentages)
  const seasonCounts: Record<string, number> = {};
  votes.forEach((v) => {
    if (v.season) seasonCounts[v.season] = (seasonCounts[v.season] ?? 0) + 1;
  });
  const seasonTotal = Object.values(seasonCounts).reduce((a, b) => a + b, 0);

  // Aggregate timeOfDay (percentages)
  const timeCounts: Record<string, number> = {};
  votes.forEach((v) => {
    if (v.timeOfDay) timeCounts[v.timeOfDay] = (timeCounts[v.timeOfDay] ?? 0) + 1;
  });
  const timeTotal = Object.values(timeCounts).reduce((a, b) => a + b, 0);

  return Response.json({
    totalVotes: votes.length,
    longevity: avgLongevity ? Math.round(avgLongevity * 10) / 10 : null,
    sillage: sillageCounts,
    priceValue: avgPrice ? Math.round(avgPrice * 10) / 10 : null,
    season: seasonTotal
      ? Object.fromEntries(
          Object.entries(seasonCounts).map(([k, v]) => [k, Math.round((v / seasonTotal) * 100)])
        )
      : null,
    timeOfDay: timeTotal
      ? Object.fromEntries(
          Object.entries(timeCounts).map(([k, v]) => [k, Math.round((v / timeTotal) * 100)])
        )
      : null,
  });
}

// POST /api/votes — submit or update performance vote
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { perfumeId, longevity, sillage, priceValue, season, timeOfDay } = body;

  if (!perfumeId) {
    return Response.json({ error: "perfumeId required" }, { status: 400 });
  }

  // Validate fields
  if (longevity !== undefined && (longevity < 1 || longevity > 10)) {
    return Response.json({ error: "longevity must be 1-10" }, { status: 400 });
  }
  if (sillage !== undefined && !VALID_SILLAGE.includes(sillage)) {
    return Response.json({ error: `sillage must be one of: ${VALID_SILLAGE.join(", ")}` }, { status: 400 });
  }
  if (priceValue !== undefined && (priceValue < 1 || priceValue > 5)) {
    return Response.json({ error: "priceValue must be 1-5" }, { status: 400 });
  }
  if (season !== undefined && !VALID_SEASON.includes(season)) {
    return Response.json({ error: `season must be one of: ${VALID_SEASON.join(", ")}` }, { status: 400 });
  }
  if (timeOfDay !== undefined && !VALID_TIME.includes(timeOfDay)) {
    return Response.json({ error: `timeOfDay must be one of: ${VALID_TIME.join(", ")}` }, { status: 400 });
  }

  const vote = await db.perfumeVote.upsert({
    where: {
      userId_perfumeId: { userId: session.user.id, perfumeId },
    },
    create: {
      userId: session.user.id,
      perfumeId,
      longevity: longevity ?? null,
      sillage: sillage ?? null,
      priceValue: priceValue ?? null,
      season: season ?? null,
      timeOfDay: timeOfDay ?? null,
    },
    update: {
      ...(longevity !== undefined && { longevity }),
      ...(sillage !== undefined && { sillage }),
      ...(priceValue !== undefined && { priceValue }),
      ...(season !== undefined && { season }),
      ...(timeOfDay !== undefined && { timeOfDay }),
    },
  });

  return Response.json(vote);
}
