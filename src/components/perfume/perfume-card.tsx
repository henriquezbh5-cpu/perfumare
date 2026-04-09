import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { PerfumeBottleSvg } from "@/components/ui/perfume-bottle-svg";
import { TransparentImage } from "@/components/ui/transparent-image";

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
  const mainColor = topAccords[0]?.color ?? "#d4a853";

  return (
    <Link href={`/perfumes/${slug}`} className="no-underline group">
      <Card hover className="h-full flex flex-col overflow-hidden transition-all duration-500 group-hover:scale-[1.03]">
        <div className="aspect-[3/4] rounded-t-lg flex items-center justify-center overflow-hidden relative">
          {/* Subtle glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-1000"
            style={{
              background: `radial-gradient(ellipse at 50% 60%, ${mainColor}25, transparent 60%)`,
            }}
          />

          {imageUrl && imageUrl.startsWith("http") ? (
            <TransparentImage
              src={imageUrl}
              alt={name}
              className="relative z-10 w-full h-full object-contain p-4 transition-all duration-700 ease-out group-hover:scale-[1.1] group-hover:-translate-y-1"
            />
          ) : (
            <div className="flex items-center justify-center opacity-50 group-hover:opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1">
              <PerfumeBottleSvg color={mainColor} size="md" />
            </div>
          )}
        </div>

        <CardBody className="flex flex-col gap-2 flex-1">
          <h3 className="font-serif text-base text-bark-500 leading-tight line-clamp-2 group-hover:text-gold-500 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm text-bark-300">{brand}</p>
          <p className="text-xs text-cream-500">
            {concentration}
            {year ? ` \u2022 ${year}` : ""}
          </p>
          <Rating value={rating} size="sm" showValue count={reviewCount} />
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
