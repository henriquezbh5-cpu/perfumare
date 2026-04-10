import { cn } from "@/lib/utils";
import { ExternalLink, ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";

interface RetailerLink {
  retailer: string;
  url: string;
  price?: string | null;
  currency?: string;
  icon?: string;
  color?: string;
  bgClass?: string;
  subtitle?: string;
}

interface WhereToBuyProps {
  links: RetailerLink[];
  className?: string;
}

export function WhereToBuy({ links, className }: WhereToBuyProps) {
  if (links.length === 0) return null;

  return (
    <section className={cn("", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-gold-500" />
          <h3 className="section-title">Where to Buy</h3>
        </div>
        <Link
          href="/affiliate-disclosure"
          className="text-[10px] text-cream-600 no-underline hover:text-cream-400 flex items-center gap-1"
        >
          <Tag size={10} />
          Affiliate links
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((link, idx) => {
          const bgClass = link.bgClass ?? "bg-cream-200/20 border-cream-300/20 hover:bg-cream-200/30";
          const color = link.color ?? "#c9a962";

          return (
            <a
              key={`${link.retailer}-${idx}`}
              href={link.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className={`flex items-center justify-between p-3.5 border rounded-xl transition-all duration-200 no-underline group ${bgClass}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{link.icon ?? "🛍️"}</span>
                <div>
                  <span className="text-sm font-semibold" style={{ color }}>
                    {link.retailer}
                  </span>
                  {link.subtitle && (
                    <p className="text-[10px] text-cream-600 mt-0.5">{link.subtitle}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {link.price && (
                  <span className="text-sm font-semibold text-bark-400">
                    ${link.price}
                  </span>
                )}
                <span
                  className="text-xs font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  style={{ color }}
                >
                  Check Price <ExternalLink size={11} />
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <p className="text-[9px] text-cream-600 mt-2 text-center">
        Perfumare earns from qualifying purchases.{" "}
        <Link href="/affiliate-disclosure" className="text-gold-500/60 no-underline hover:text-gold-500">
          Learn more
        </Link>
      </p>
    </section>
  );
}
