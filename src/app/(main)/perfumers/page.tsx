import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Perfumers | Perfumare",
  description:
    "Discover the master perfumers and nose creators behind your favorite fragrances.",
};

export default async function PerfumersPage() {
  const perfumers = await db.perfumer.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { perfumes: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-bark-500 mb-2">Perfumers</h1>
        <p className="text-sm text-cream-500">
          {perfumers.length} master{" "}
          {perfumers.length === 1 ? "perfumer" : "perfumers"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {perfumers.map((perfumer) => (
          <Link
            key={perfumer.id}
            href={`/perfumers/${perfumer.slug}`}
            className="no-underline"
          >
            <Card hover className="h-full">
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-100 border border-gold-300 text-gold-500 flex items-center justify-center text-lg font-serif shrink-0">
                  {getInitials(perfumer.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-bark-500 text-sm truncate">
                    {perfumer.name}
                  </h3>
                  {perfumer.nationality && (
                    <p className="text-xs text-cream-500">
                      {perfumer.nationality}
                    </p>
                  )}
                  <p className="text-xs text-cream-500">
                    {perfumer._count.perfumes}{" "}
                    {perfumer._count.perfumes === 1 ? "creation" : "creations"}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
