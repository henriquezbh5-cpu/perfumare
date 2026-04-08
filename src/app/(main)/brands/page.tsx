import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All Brands | 1000PerfumesNight",
  description:
    "Explore our directory of perfume brands from around the world, including designer and Arabian houses.",
};

export default async function BrandsPage() {
  const brands = await db.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { perfumes: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-bark-500 mb-2">Brands</h1>
        <p className="text-sm text-cream-500">
          {brands.length} {brands.length === 1 ? "brand" : "brands"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="no-underline"
          >
            <Card hover className="h-full">
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-bark-500 text-gold-400 flex items-center justify-center text-lg font-serif shrink-0">
                  {getInitials(brand.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-bark-500 text-sm truncate">
                    {brand.name}
                  </h3>
                  {brand.country && (
                    <p className="text-xs text-cream-500">{brand.country}</p>
                  )}
                  <p className="text-xs text-cream-500">
                    {brand._count.perfumes}{" "}
                    {brand._count.perfumes === 1 ? "perfume" : "perfumes"}
                  </p>
                </div>
                {brand.category === "Arabian" && (
                  <Badge variant="arabian" className="shrink-0 text-[10px]">
                    Arabian
                  </Badge>
                )}
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
