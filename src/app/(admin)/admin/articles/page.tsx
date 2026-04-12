import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArticleForm } from "./article-form";

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; id?: string }>;
}) {
  const params = await searchParams;
  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, username: true } },
    },
  });

  const editArticle =
    params.action === "edit" && params.id
      ? articles.find((a) => a.id === params.id) ?? null
      : null;

  const showForm = params.action === "create" || editArticle;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-bark-500 text-glow">Articles</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-cream-600">{articles.length} total</p>
          <Link
            href="/admin/articles?action=create"
            className="px-3 py-1.5 rounded-lg bg-gold-500 text-cream-50 text-xs font-medium hover:bg-gold-600 transition-colors no-underline"
          >
            + Create Article
          </Link>
        </div>
      </div>

      {showForm && (
        <ArticleForm
          article={
            editArticle
              ? {
                  id: editArticle.id,
                  title: editArticle.title,
                  body: editArticle.body,
                  excerpt: editArticle.excerpt,
                  category: editArticle.category,
                  tags: editArticle.tags,
                  featuredImage: editArticle.featuredImage,
                  publishedAt: editArticle.publishedAt,
                }
              : undefined
          }
        />
      )}

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
              <div className="flex gap-2">
                <Link
                  href={`/admin/articles?action=edit&id=${a.id}`}
                  className="text-xs text-gold-500 hover:text-gold-400 no-underline"
                >
                  Edit
                </Link>
                <Link
                  href={`/magazine/${a.slug}`}
                  className="text-xs text-cream-500 hover:text-bark-400 no-underline"
                >
                  View
                </Link>
              </div>
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
