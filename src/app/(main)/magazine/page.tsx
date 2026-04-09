import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Magazine | Perfumare",
  description: "Expert articles, reviews, guides, and interviews from the world of perfumery.",
};

const categoryColors: Record<string, string> = {
  Reviews: "default",
  Guides: "gold",
  News: "arabian",
  Interviews: "gold",
  Lists: "default",
};

export default async function MagazinePage() {
  const articles = await db.article.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: {
      author: { select: { name: true, username: true, image: true } },
    },
  });

  // Featured = first article
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center py-6">
        <p className="section-title mb-2">Editorial</p>
        <h1 className="text-3xl md:text-4xl font-serif text-bark-500 text-glow">
          Magazine
        </h1>
        <p className="text-bark-300 mt-2 max-w-lg mx-auto">
          Expert articles, guides, and stories from the world of perfumery
        </p>
      </div>

      {/* Featured article */}
      {featured && (
        <Link
          href={`/magazine/${featured.slug}`}
          className="glass-card block overflow-hidden hover-glow no-underline group"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-video md:aspect-auto bg-cream-200/10 flex items-center justify-center">
              {featured.featuredImage ? (
                <img
                  src={featured.featuredImage}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen size={48} className="text-cream-500" strokeWidth={1} />
              )}
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <Badge variant={categoryColors[featured.category] as "default" | "gold" | "arabian" ?? "default"} className="self-start mb-3">
                {featured.category}
              </Badge>
              <h2 className="text-2xl font-serif text-bark-500 group-hover:text-gold-500 transition-colors mb-3">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="text-sm text-bark-300 line-clamp-3 mb-4">
                  {featured.excerpt}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-cream-600">
                <span className="text-gold-500">
                  {featured.author.name ?? featured.author.username}
                </span>
                <span>&middot;</span>
                <span>
                  {featured.publishedAt &&
                    new Date(featured.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Article grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((article) => (
            <Link
              key={article.id}
              href={`/magazine/${article.slug}`}
              className="glass-card overflow-hidden hover-glow no-underline group flex flex-col"
            >
              <div className="aspect-video bg-cream-200/10 flex items-center justify-center">
                {article.featuredImage ? (
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen size={32} className="text-cream-500" strokeWidth={1} />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <Badge variant={categoryColors[article.category] as "default" | "gold" | "arabian" ?? "default"} className="self-start mb-2">
                  {article.category}
                </Badge>
                <h3 className="font-serif text-bark-500 group-hover:text-gold-500 transition-colors mb-2 line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-bark-200 line-clamp-2 mb-3 flex-1">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-cream-600 mt-auto">
                  <span className="text-gold-500/80">
                    {article.author.name ?? article.author.username}
                  </span>
                  <span>&middot;</span>
                  <span>
                    {article.publishedAt &&
                      new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {articles.length === 0 && (
        <div className="glass-card text-center py-16">
          <BookOpen size={40} className="mx-auto mb-4 text-cream-500" strokeWidth={1.2} />
          <h3 className="font-serif text-lg text-bark-400 mb-2">Coming Soon</h3>
          <p className="text-sm text-cream-500">
            Our editorial team is working on amazing content. Stay tuned!
          </p>
        </div>
      )}
    </div>
  );
}
