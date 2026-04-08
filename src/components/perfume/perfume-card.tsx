import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { PerfumeBottleSvg } from "@/components/ui/perfume-bottle-svg";

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
  const mainColor = topAccords[0]?.color ?? "#c9a962";

  return (
    <Link href={`/perfumes/${slug}`} className="no-underline group">
      <Card hover className="h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        {/* Image / Bottle placeholder */}
        <div
          className="aspect-[3/4] rounded-t-lg flex items-center justify-center overflow-hidden relative"
          style={{
            background: imageUrl
              ? undefined
              : `linear-gradient(135deg, ${mainColor}10, ${mainColor}08, #f5f0e8)`,
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center opacity-60 group-hover:opacity-80 transition-opacity duration-300">
              <PerfumeBottleSvg color={mainColor} size="md" />
            </div>
          )}
          {/* Subtle gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/60 to-transparent" />
        </div>

        <CardBody className="flex flex-col gap-2 flex-1">
          {/* Name */}
          <h3 className="font-serif text-base text-bark-500 leading-tight line-clamp-2 group-hover:text-gold-600 transition-colors">
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
