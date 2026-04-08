import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";

interface PerfumeCardProps {
  slug: string;
  name: string;
  brand: string;
  year?: number | null;
  concentration: string;
  imageUrl?: string | null;
  rating: number;
  reviewCount: number;
  topAccords?: { name: string; color: string }[];
}

export function PerfumeCard({
  slug,
  name,
  brand,
  year,
  concentration,
  imageUrl,
  rating,
  reviewCount,
  topAccords = [],
}: PerfumeCardProps) {
  return (
    <Link href={`/perfumes/${slug}`} className="no-underline">
      <Card hover className="h-full flex flex-col">
        {/* Image placeholder */}
        <div className="aspect-[3/4] bg-cream-100 rounded-t-lg flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl opacity-60">&#127798;</span>
          )}
        </div>

        <CardBody className="flex flex-col gap-2 flex-1">
          {/* Name */}
          <h3 className="font-serif text-base text-bark-500 leading-tight line-clamp-2">
            {name}
          </h3>

          {/* Brand */}
          <p className="text-sm text-bark-300">{brand}</p>

          {/* Concentration + Year */}
          <p className="text-xs text-cream-500">
            {concentration}
            {year ? ` \u2022 ${year}` : ""}
          </p>

          {/* Rating */}
          <Rating
            value={rating}
            size="sm"
            showValue
            count={reviewCount}
          />

          {/* Top accords */}
          {topAccords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-2">
              {topAccords.slice(0, 3).map((accord) => (
                <Badge key={accord.name} className="text-[10px]">
                  {accord.name}
                </Badge>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}
