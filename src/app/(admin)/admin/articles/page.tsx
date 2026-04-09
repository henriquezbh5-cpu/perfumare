import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminArticlesPage() {
  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, username: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-bark-500 text-glow">Articles</h1>
        <p className="text-sm text-cream-600">{articles.length} total</p>
      </div>

      {articles.length > 0 ? (
        <div className="glass-card divide-y divide-cream-300/10">
          {articles.map((a) => (
            <div key={a.id} className="px-4 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge>{a.category}</Badge>
                  {!a.publishedAt && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cream-400/20 text-cream-600">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-bark-400 font-medium">{a.title}</p>
                <p className="text-xs text-cream-600 mt-1">
                  by {a.author.name ?? a.author.username} &middot;{" "}
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link href={`/magazine/${a.slug}`} className="text-xs text-gold-500 hover:text-gold-400 no-underline">
                View
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card text-center py-12">
          <p className="text-cream-500">No articles yet</p>
        </div>
      )}
    </div>
  );
}
