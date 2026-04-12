import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getInitials } from "@/lib/utils";
import { Users, Star, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Members",
  description:
    "Browse the Perfumare community. Connect with fragrance enthusiasts, reviewers, and collectors.",
};

export default async function CommunityMembersPage() {
  const members = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          reviews: true,
          forumPosts: true,
          wardrobe: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <nav className="text-sm text-cream-500 mb-4">
          <Link
            href="/community"
            className="hover:text-gold-500 no-underline text-cream-500"
          >
            Community
          </Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-bark-400">Members</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif text-bark-500 text-glow">
              Members
            </h1>
            <p className="text-bark-200 mt-2">
              {members.length} fragrance enthusiasts and counting.
            </p>
          </div>
          <div className="flex items-center gap-2 text-cream-500">
            <Users size={20} />
            <span className="text-lg font-serif text-bark-400">
              {members.length}
            </span>
          </div>
        </div>
      </div>

      {/* Members grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {members.map((member) => (
          <Link
            key={member.id}
            href={`/${member.username ?? member.id}`}
            className="glass-card p-4 hover:shadow-card-hover transition-all no-underline group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-gold-500/10 border border-gold-400/20 flex items-center justify-center overflow-hidden shrink-0">
                {member.image ? (
                  <img
                    src={member.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-gold-500">
                    {getInitials(
                      member.name ?? member.username ?? "U"
                    )}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-bark-400 group-hover:text-gold-500 transition-colors truncate">
                  {member.name ?? member.username ?? "Anonymous"}
                </p>
                {member.username && (
                  <p className="text-xs text-cream-600 truncate">
                    @{member.username}
                  </p>
                )}
              </div>
            </div>

            {member.bio && (
              <p className="text-xs text-bark-200 line-clamp-2 mb-3">
                {member.bio}
              </p>
            )}

            <div className="flex items-center gap-3 text-[11px] text-cream-600">
              <span className="flex items-center gap-1">
                <Star size={10} /> {member._count.reviews}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={10} /> {member._count.forumPosts}
              </span>
              <span>
                {member._count.wardrobe} perfumes
              </span>
            </div>

            <p className="text-[10px] text-cream-600 mt-2">
              Member since{" "}
              {new Date(member.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </Link>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-12">
          <Users size={32} className="mx-auto mb-3 text-cream-400" />
          <p className="text-cream-500">No members yet. Be the first to join!</p>
          <Link
            href="/login"
            className="inline-block mt-4 text-sm text-gold-500 hover:text-gold-400 no-underline"
          >
            Sign up now
          </Link>
        </div>
      )}
    </div>
  );
}
