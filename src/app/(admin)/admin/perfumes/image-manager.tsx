"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PerfumeRow {
  id: string;
  name: string;
  slug: string;
  brand: string;
  gender: string;
  year: number | null;
  concentration: string;
  imageUrl: string | null;
  reviewCount: number;
}

export function PerfumeImageManager({ perfumes }: { perfumes: PerfumeRow[] }) {
  const [filter, setFilter] = useState<"all" | "missing" | "has">("all");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(perfumes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = items.filter((p) => {
    if (filter === "missing" && p.imageUrl) return false;
    if (filter === "has" && !p.imageUrl) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/perfumes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: urlInput.trim() || null }),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems((prev) =>
          prev.map((p) => (p.id === id ? { ...p, imageUrl: updated.imageUrl } : p))
        );
        setEditingId(null);
        setUrlInput("");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: PerfumeRow) => {
    setEditingId(p.id);
    setUrlInput(p.imageUrl ?? "");
  };

  const withImage = items.filter((p) => p.imageUrl).length;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg bg-cream-100/30 border border-cream-300/20 text-bark-400 text-sm w-64 focus:outline-none focus:border-gold-500/50"
        />
        <div className="flex gap-1">
          {(["all", "missing", "has"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                filter === f
                  ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                  : "bg-cream-100/20 text-cream-600 border border-cream-300/10 hover:bg-cream-100/30"
              }`}
            >
              {f === "all" ? "All" : f === "missing" ? "Missing Image" : "Has Image"}
            </button>
          ))}
        </div>
        <span className="text-xs text-cream-600 ml-auto">
          {filtered.length} shown &middot; {withImage}/{items.length} with images
        </span>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-300/10 text-left">
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider w-12">Img</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Brand</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Gender</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Year</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider min-w-[300px]">Image URL</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-300/10">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-cream-200/10 transition-colors">
                <td className="px-4 py-2">
                  {p.imageUrl ? (
                    <div className="w-10 h-10 rounded overflow-hidden bg-cream-100/20">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded bg-cream-100/10 flex items-center justify-center">
                      <span className="text-cream-600 text-xs">—</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 text-bark-400 font-medium">{p.name}</td>
                <td className="px-4 py-2 text-bark-300">{p.brand}</td>
                <td className="px-4 py-2">
                  <Badge>{p.gender}</Badge>
                </td>
                <td className="px-4 py-2 text-cream-600">{p.year ?? "—"}</td>
                <td className="px-4 py-2">
                  {editingId === p.id ? (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-2 py-1 rounded bg-cream-100/30 border border-gold-500/30 text-bark-400 text-xs focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(p.id);
                          if (e.key === "Escape") {
                            setEditingId(null);
                            setUrlInput("");
                          }
                        }}
                      />
                      <button
                        onClick={() => handleSave(p.id)}
                        disabled={saving}
                        className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/30 disabled:opacity-50"
                      >
                        {saving ? "..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setUrlInput("");
                        }}
                        className="px-2 py-1 rounded bg-cream-100/20 text-cream-600 text-xs hover:bg-cream-100/30"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs ${p.imageUrl ? "text-emerald-400" : "text-amber-400/60"}`}>
                      {p.imageUrl ? p.imageUrl.substring(0, 50) + "..." : "No image"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-xs text-gold-500 hover:text-gold-400"
                    >
                      {p.imageUrl ? "Edit" : "Add"}
                    </button>
                    <Link
                      href={`/perfumes/${p.slug}`}
                      className="text-xs text-cream-600 hover:text-cream-400 no-underline"
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
