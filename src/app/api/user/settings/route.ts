import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";

// PUT /api/user/settings — update current user profile
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { username, name, bio, image, locale } = body;

  // Validate username if provided
  if (username !== undefined) {
    if (typeof username !== "string" || username.length < 3 || username.length > 20) {
      return Response.json({ error: "Username must be 3-20 characters" }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return Response.json({ error: "Username can only contain letters, numbers, hyphens, and underscores" }, { status: 400 });
    }
    // Check uniqueness
    const existing = await db.user.findFirst({
      where: { username, NOT: { id: session.user.id } },
    });
    if (existing) {
      return Response.json({ error: "Username already taken" }, { status: 409 });
    }
  }

  if (bio !== undefined && typeof bio === "string" && bio.length > 500) {
    return Response.json({ error: "Bio must be 500 characters or less" }, { status: 400 });
  }

  if (locale !== undefined && !["en", "es"].includes(locale)) {
    return Response.json({ error: "Locale must be 'en' or 'es'" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(username !== undefined && { username }),
      ...(name !== undefined && { name }),
      ...(bio !== undefined && { bio }),
      ...(image !== undefined && { image }),
      ...(locale !== undefined && { locale }),
    },
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      image: true,
      locale: true,
      email: true,
    },
  });

  return Response.json(updated);
}
