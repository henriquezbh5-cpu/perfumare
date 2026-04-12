"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BrandFormProps {
  brand?: {
    id: string;
    name: string;
    country: string | null;
    description: string | null;
    logoUrl: string | null;
    websiteUrl: string | null;
    founded: number | null;
    category: string;
  };
}

const categories = ["Designer", "Niche", "Arabian", "Independent"];

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      ...(brand ? { id: brand.id } : {}),
      name: form.get("name"),
      country: form.get("country"),
      description: form.get("description"),
      logoUrl: form.get("logoUrl"),
      websiteUrl: form.get("websiteUrl"),
      founded: form.get("founded"),
      category: form.get("category"),
    };

    const res = await fetch("/api/admin/brands", {
      method: brand ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to save");
      setLoading(false);
      return;
    }

    router.push("/admin/brands");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 max-w-2xl">
      <h2 className="text-lg font-serif text-bark-500">
        {brand ? "Edit Brand" : "Create Brand"}
      </h2>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Name *</label>
          <input
            name="name"
            defaultValue={brand?.name ?? ""}
            required
            className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Category</label>
          <select
            name="category"
            defaultValue={brand?.category ?? "Designer"}
            className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Country</label>
          <input
            name="country"
            defaultValue={brand?.country ?? ""}
            className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Founded</label>
          <input
            name="founded"
            type="number"
            defaultValue={brand?.founded ?? ""}
            className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Website URL</label>
          <input
            name="websiteUrl"
            defaultValue={brand?.websiteUrl ?? ""}
            className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Logo URL</label>
          <input
            name="logoUrl"
            defaultValue={brand?.logoUrl ?? ""}
            className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-cream-600 uppercase tracking-wider mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={brand?.description ?? ""}
            className="w-full px-3 py-2 rounded-lg bg-cream-100/20 border border-cream-300/20 text-bark-400 text-sm focus:outline-none focus:border-gold-500/50 resize-y"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-gold-500 text-cream-50 text-sm font-medium hover:bg-gold-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : brand ? "Update Brand" : "Create Brand"}
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
