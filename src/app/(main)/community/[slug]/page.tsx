import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getInitials } from "@/lib/utils";
import { MessageSquare, Eye, Pin, Lock } from "lucide-react";
import { NewThreadButton } from "@/components/community/new-thread-button";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await db.forumCategory.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };
  return { title: `${category.name} | Community` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await db.forumCategory.findUnique({
    where: { slug },
  });

  if (!category) notFound();

  const threads = await db.forumThread.findMany({
    where: { categoryId: category.id },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    take: 50,
    include: {
      user: { select: { id: true, username: true, name: true, image: true } },
      _count: { select: { posts: true } },
    },
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-cream-500">
        <Link href="/community" className="hover:text-gold-500 no-underline text-cream-500">
          Community
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-bark-400">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-bark-500 text-glow">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-sm text-bark-200 mt-1">{category.description}</p>
          )}
        </div>
        <NewThreadButton categoryId={category.id} />
      </div>

      {/* Threads */}
      <div className="space-y-2">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <Link
              key={thread.id}
              href={`/community/${slug}/${thread.id}`}
              className="glass-card block p-4 hover-glow no-underline group"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-400/20 flex items-center justify-center overflow-hidden shrink-0">
                  {thread.user.image ? (
                    <img src={thread.user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-medium text-gold-500">
                      {getInitials(thread.user.name ?? thread.user.username ?? "A")}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {thread.isPinned && <Pin size={12} className="text-gold-500" />}
                    {thread.isLocked && <Lock size={12} className="text-cream-500" />}
                    <h3 className="font-medium text-bark-400 group-hover:text-gold-500 transition-colors truncate">
                      {thread.title}
                    </h3>
                  </div>
                  <p className="text-xs text-cream-600 mt-1">
                    by{" "}
                    <span className="text-gold-500/80">
                      {thread.user.name ?? thread.user.username ?? "Anonymous"}
                    </span>
                    {" \u00b7 "}
                    {new Date(thread.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 shrink-0 text-cream-600">
                  <div className="flex items-center gap-1 text-xs">
                    <MessageSquare size={12} />
                    {thread._count.posts}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Eye size={12} />
                    {thread.viewCount}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="glass-card text-center py-12">
            <MessageSquare size={32} className="mx-auto mb-3 text-cream-500" strokeWidth={1.2} />
            <p className="text-cream-500 mb-1 font-serif">No threads yet</p>
            <p className="text-sm text-cream-600">Be the first to start a discussion!</p>
          </div>
        )}
      </div>
    </div>
  );
}
