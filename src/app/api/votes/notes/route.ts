import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { perfumeId, noteId } = await request.json();

  if (!perfumeId || !noteId) {
    return Response.json({ error: "perfumeId and noteId required" }, { status: 400 });
  }

  const perfumeNote = await db.perfumeNote.update({
    where: { perfumeId_noteId: { perfumeId, noteId } },
    data: { voteCount: { increment: 1 } },
  });

  return Response.json({ voteCount: perfumeNote.voteCount });
}
