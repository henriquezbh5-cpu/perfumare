import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | Magazine | Perfumare`,
    description: article.excerpt ?? undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = await db.article.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, username: true, image: true, bio: true } },
    },
  });

  if (!article || !article.publishedAt) notFound();

  // Estimate reading time (200 words per minute)
  const wordCount = article.body.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back */}
      <Link
        href="/magazine"
        className="inline-flex items-center gap-1.5 text-sm text-cream-600 hover:text-gold-500 no-underline transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Magazine
      </Link>

      {/* Header */}
      <div>
        <Badge className="mb-3">{article.category}</Badge>
        <h1 className="text-3xl md:text-4xl font-serif text-bark-500 text-glow leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-cream-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-400/20 flex items-center justify-center overflow-hidden">
              {article.author.image ? (
                <img src={article.author.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-gold-500">
                  {getInitials(article.author.name ?? article.author.username ?? "A")}
                </span>
              )}
            </div>
            <span className="text-gold-500">
              {article.author.name ?? article.author.username}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={13} />
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={13} />
            {readingTime} min read
          </div>
        </div>
      </div>

      {/* Featured image */}
      {article.featuredImage && (
        <div className="aspect-video rounded-xl overflow-hidden border border-cream-300/10">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Body */}
      <article className="prose prose-invert max-w-none text-bark-300 leading-relaxed whitespace-pre-wrap">
        {article.body}
      </article>

      {/* Author card */}
      <div className="glass-card p-6 mt-12">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-400/20 flex items-center justify-center overflow-hidden shrink-0">
            {article.author.image ? (
              <img src={article.author.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-medium text-gold-500">
                {getInitials(article.author.name ?? article.author.username ?? "A")}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-cream-600 uppercase tracking-wider mb-1">Written by</p>
            <p className="font-serif text-bark-500">
              {article.author.name ?? article.author.username}
            </p>
            {article.author.bio && (
              <p className="text-sm text-bark-200 mt-1">{article.author.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
