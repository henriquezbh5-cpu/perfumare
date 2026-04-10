import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return Response.json({ error: "Valid email required" }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();

  // Use User model — create a minimal record or just log
  // For now, we'll store in a simple approach: check if user exists, if not create minimal
  const existing = await db.user.findUnique({ where: { email: normalized } });

  if (!existing) {
    await db.user.create({
      data: {
        email: normalized,
        role: "subscriber",
      },
    });
  }

  return Response.json({ success: true });
}
