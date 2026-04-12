import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkAndAwardBadges } from "@/lib/badges";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const awarded = await checkAndAwardBadges(session.user.id);
  return NextResponse.json({ awarded });
}
