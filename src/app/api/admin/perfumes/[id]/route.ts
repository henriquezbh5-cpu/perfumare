import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { imageUrl } = body;

  if (typeof imageUrl !== "string" && imageUrl !== null) {
    return Response.json({ error: "imageUrl must be a string or null" }, { status: 400 });
  }

  const perfume = await db.perfume.update({
    where: { id },
    data: { imageUrl: imageUrl || null },
    select: { id: true, name: true, imageUrl: true },
  });

  return Response.json(perfume);
}
