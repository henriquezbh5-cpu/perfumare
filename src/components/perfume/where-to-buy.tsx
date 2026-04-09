import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface RetailerLink {
  retailer: string;
  url: string;
  price?: string | null;
  currency?: string;
}

interface WhereToBuyProps {
  links: RetailerLink[];
  className?: string;
}

export function WhereToBuy({ links, className }: WhereToBuyProps) {
  if (links.length === 0) return null;

  return (
    <section className={cn("", className)}>
      <h3 className="section-title mb-4">Where to Buy</h3>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <a
            key={`${link.retailer}-${idx}`}
            href={link.url}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex items-center justify-between p-3 bg-cream-200/30 backdrop-blur-sm border border-cream-300/20 rounded-lg hover:shadow-card-hover transition-shadow no-underline group"
          >
            <span className="text-sm font-medium text-bark-400">
              {link.retailer}
            </span>
            <div className="flex items-center gap-3">
              {link.price && (
                <span className="text-sm font-medium text-gold-500">
                  {link.currency ?? "USD"} {link.price}
                </span>
              )}
              <span className="text-xs text-cream-500 group-hover:text-gold-500 transition-colors inline-flex items-center gap-1">
                View <ExternalLink size={12} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
