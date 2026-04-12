import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BrandForm } from "./brand-form";

export default async function AdminBrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; id?: string }>;
}) {
  const params = await searchParams;
  const brands = await db.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { perfumes: true } } },
  });

  const editBrand =
    params.action === "edit" && params.id
      ? brands.find((b) => b.id === params.id) ?? null
      : null;

  const showForm = params.action === "create" || editBrand;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-bark-500 text-glow">Brands</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-cream-600">{brands.length} total</p>
          <Link
            href="/admin/brands?action=create"
            className="px-3 py-1.5 rounded-lg bg-gold-500 text-cream-50 text-xs font-medium hover:bg-gold-600 transition-colors no-underline"
          >
            + Create Brand
          </Link>
        </div>
      </div>

      {showForm && (
        <BrandForm
          brand={
            editBrand
              ? {
                  id: editBrand.id,
                  name: editBrand.name,
                  country: editBrand.country,
                  description: editBrand.description,
                  logoUrl: editBrand.logoUrl,
                  websiteUrl: editBrand.websiteUrl,
                  founded: editBrand.founded,
                  category: editBrand.category,
                }
              : undefined
          }
        />
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-300/10 text-left">
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Country</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Perfumes</th>
              <th className="px-4 py-3 text-xs text-cream-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-300/10">
            {brands.map((b) => (
              <tr key={b.id} className="hover:bg-cream-200/10 transition-colors">
                <td className="px-4 py-3 text-bark-400 font-medium">{b.name}</td>
                <td className="px-4 py-3"><Badge>{b.category}</Badge></td>
                <td className="px-4 py-3 text-cream-600">{b.country ?? "\u2014"}</td>
                <td className="px-4 py-3 text-cream-600">{b._count.perfumes}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Link
                    href={`/admin/brands?action=edit&id=${b.id}`}
                    className="text-xs text-gold-500 hover:text-gold-400 no-underline"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/brands/${b.slug}`}
                    className="text-xs text-cream-500 hover:text-bark-400 no-underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
