import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getInitials } from "@/lib/utils";
import { Pin, Lock } from "lucide-react";
import { ReplyForm } from "@/components/community/reply-form";

type Props = { params: Promise<{ slug: string; threadId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { threadId } = await params;
  const thread = await db.forumThread.findUnique({
    where: { id: threadId },
    select: { title: true },
  });
  if (!thread) return { title: "Thread Not Found" };
  return { title: `${thread.title} | Community` };
}

export default async function ThreadPage({ params }: Props) {
  const { slug, threadId } = await params;

  const category = await db.forumCategory.findUnique({ where: { slug } });
  if (!category) notFound();

  const thread = await db.forumThread.findUnique({
    where: { id: threadId },
    include: {
      user: { select: { username: true, name: true, image: true } },
    },
  });

  if (!thread) notFound();

  // Increment view count
  await db.forumThread.update({
    where: { id: threadId },
    data: { viewCount: { increment: 1 } },
  });

  const posts = await db.forumPost.findMany({
    where: { threadId, deletedAt: null },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, username: true, name: true, image: true, role: true, createdAt: true } },
      quotedPost: {
        select: {
          body: true,
          user: { select: { username: true, name: true } },
        },
      },
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
        <Link href={`/community/${slug}`} className="hover:text-gold-500 no-underline text-cream-500">
          {category.name}
        </Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-bark-400 truncate">{thread.title}</span>
      </nav>

      {/* Thread header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-1">
          {thread.isPinned && <Pin size={14} className="text-gold-500" />}
          {thread.isLocked && <Lock size={14} className="text-cream-500" />}
          <h1 className="text-xl font-serif text-bark-500 text-glow">
            {thread.title}
          </h1>
        </div>
        <p className="text-xs text-cream-600">
          Started by{" "}
          <span className="text-gold-500">
            {thread.user.name ?? thread.user.username ?? "Anonymous"}
          </span>
          {" \u00b7 "}
          {new Date(thread.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" \u00b7 "}
          {thread.viewCount + 1} views
        </p>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {posts.map((post, index) => (
          <div key={post.id} className="glass-card p-5">
            <div className="flex gap-4">
              {/* Author sidebar */}
              <div className="hidden sm:flex flex-col items-center w-24 shrink-0">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-400/20 flex items-center justify-center overflow-hidden mb-2">
                  {post.user.image ? (
                    <img src={post.user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium text-gold-500">
                      {getInitials(post.user.name ?? post.user.username ?? "A")}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-bark-400 text-center truncate w-full">
                  {post.user.name ?? post.user.username ?? "Anonymous"}
                </p>
                {post.user.role !== "user" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20 mt-1">
                    {post.user.role}
                  </span>
                )}
                <p className="text-[10px] text-cream-600 mt-1">
                  Member since {new Date(post.user.createdAt).getFullYear()}
                </p>
              </div>

              {/* Post content */}
              <div className="flex-1 min-w-0">
                {/* Mobile author */}
                <div className="flex sm:hidden items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-400/20 flex items-center justify-center overflow-hidden">
                    {post.user.image ? (
                      <img src={post.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-medium text-gold-500">
                        {getInitials(post.user.name ?? post.user.username ?? "A")}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-bark-400">
                      {post.user.name ?? post.user.username ?? "Anonymous"}
                    </p>
                    <p className="text-[10px] text-cream-600">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Quoted post */}
                {post.quotedPost && (
                  <div className="mb-3 pl-3 border-l-2 border-gold-500/20 py-2 bg-cream-200/10 rounded-r-lg px-3">
                    <p className="text-xs text-gold-500/80 mb-1">
                      {post.quotedPost.user.name ?? post.quotedPost.user.username} wrote:
                    </p>
                    <p className="text-sm text-cream-600 italic line-clamp-3">
                      {post.quotedPost.body}
                    </p>
                  </div>
                )}

                {/* Post body */}
                <div className="text-sm text-bark-300 leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </div>

                {/* Post meta */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-300/10">
                  <p className="text-xs text-cream-600 hidden sm:block">
                    #{index + 1} · {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply form */}
      {!thread.isLocked && (
        <ReplyForm threadId={threadId} />
      )}

      {thread.isLocked && (
        <div className="glass-card text-center py-6">
          <Lock size={20} className="mx-auto mb-2 text-cream-500" />
          <p className="text-sm text-cream-500">This thread is locked. No new replies can be posted.</p>
        </div>
      )}
    </div>
  );
}
