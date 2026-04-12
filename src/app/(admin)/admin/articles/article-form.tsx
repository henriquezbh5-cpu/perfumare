"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ArticleFormProps {
  article?: {
    id: string;
    title: string;
    body: string;
    excerpt: string | null;
    category: string;
    tags: string[];
    featuredImage: string | null;
    publishedAt: Date | null;
  };
}

const articleCategories = ["Reviews", "Guides", "News", "Interviews", "Lists"];

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tags, setTags] = useState(article?.tags?.join(", ") ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const publish = form.get("publish") === "on";

    const data = {
      ...(article ? { id: article.id } : {}),
      title: form.get("title"),
      body: form.get("body"),
      excerpt: form.get("excerpt"),
      category: form.get("category"),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      featuredImage: form.get("featuredImage"),
      publish,
    };

    const res = await fetch("/api/admin/articles", {
      method: article ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to save");
      setLoading(false);
      return;
    }

    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 max-w-3xl">
      <h2 className="text-lg font-serif text-bark-500">
        {article ? "Edit Article" : "Create Article"}
      </h2>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded">{error}</p>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Title *</label>
            <input
              name="title"
              defaultValue={article?.title ?? ""}
              required
              className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Category *</label>
            <select
              name="category"
              defaultValue={article?.category ?? "Reviews"}
              className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50"
            >
              {articleCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Excerpt</label>
          <input
            name="excerpt"
            defaultValue={article?.excerpt ?? ""}
            className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50"
          />
        </div>

        <div>
          <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Body (Markdown) *</label>
          <textarea
            name="body"
            rows={12}
            defaultValue={article?.body ?? ""}
            required
            className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm font-mono focus:outline-none focus:border-gold-500/50 resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Tags (comma-separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="oud, arabian, review"
              className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Featured Image URL</label>
            <input
              name="featuredImage"
              defaultValue={article?.featuredImage ?? ""}
              className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-bark-300">
          <input
            type="checkbox"
            name="publish"
            defaultChecked={!!article?.publishedAt}
            className="rounded border-cream-300/20"
          />
          Publish immediately
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-gold-500 text-cream-50 text-sm font-medium hover:bg-gold-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : article ? "Update Article" : "Create Article"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg border border-cream-300/20 text-bark-300 text-sm hover:bg-cream-200/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
