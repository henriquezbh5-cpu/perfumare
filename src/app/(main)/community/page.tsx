import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { MessageSquare, Users, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Community ",
  description: "Join the Perfumare community. Discuss fragrances, share recommendations, and connect with perfume enthusiasts.",
};

export default async function CommunityPage() {
  const categories = await db.forumCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { threads: true } },
      threads: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          title: true,
          createdAt: true,
          user: { select: { username: true, name: true } },
        },
      },
    },
  });

  const totalThreads = categories.reduce((sum, c) => sum + c._count.threads, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl md:text-4xl font-serif text-bark-500 text-glow mb-2">
          Community
        </h1>
        <p className="text-bark-300 max-w-lg mx-auto">
          Discuss fragrances, share your discoveries, and connect with fellow enthusiasts
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-1.5 text-sm text-cream-600">
            <MessageSquare size={14} className="text-gold-500" />
            {totalThreads} threads
          </div>
          <div className="flex items-center gap-1.5 text-sm text-cream-600">
            <Users size={14} className="text-gold-500" />
            Community
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {categories.length > 0 ? (
          categories.map((category) => {
            const lastThread = category.threads[0];

            return (
              <Link
                key={category.id}
                href={`/community/${category.slug}`}
                className="glass-card block p-5 hover-glow no-underline group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg text-bark-500 group-hover:text-gold-500 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-bark-200 mt-1">
                        {category.description}
                      </p>
                    )}
                    {lastThread && (
                      <p className="text-xs text-cream-600 mt-2">
                        Latest: &ldquo;{lastThread.title}&rdquo; by{" "}
                        <span className="text-gold-500">
                          {lastThread.user.name ?? lastThread.user.username ?? "Anonymous"}
                        </span>
                        {" \u00b7 "}
                        {new Date(lastThread.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <div className="text-center">
                      <p className="text-lg font-serif text-bark-500">
                        {category._count.threads}
                      </p>
                      <p className="text-xs text-cream-600">threads</p>
                    </div>
                    <ChevronRight size={18} className="text-cream-500 group-hover:text-gold-500 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="glass-card text-center py-16">
            <MessageSquare size={40} className="mx-auto mb-4 text-cream-500" strokeWidth={1.2} />
            <h3 className="font-serif text-lg text-bark-400 mb-2">No forums yet</h3>
            <p className="text-sm text-cream-500">
              Forum categories will appear here once they&apos;re created by an admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
