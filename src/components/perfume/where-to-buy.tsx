import { cn } from "@/lib/utils";
import { ExternalLink, ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";

interface RetailerLink {
  retailer: string;
  url: string;
  price?: string | null;
  currency?: string;
}

interface WhereToBuyProps {
  links: RetailerLink[];
  perfumeName?: string;
  className?: string;
}

const retailerLogos: Record<string, { bg: string; text: string; icon: string }> = {
  Amazon: { bg: "bg-[#FF9900]/10 border-[#FF9900]/30 hover:bg-[#FF9900]/20", text: "text-[#FF9900]", icon: "🛒" },
  FragranceNet: { bg: "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20", text: "text-emerald-400", icon: "🌿" },
  Sephora: { bg: "bg-white/10 border-white/30 hover:bg-white/20", text: "text-white", icon: "✨" },
  Notino: { bg: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20", text: "text-blue-400", icon: "💧" },
};

export function WhereToBuy({ links, perfumeName, className }: WhereToBuyProps) {
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
      <div className="space-y-2">
        {links.map((link, idx) => {
          const style = retailerLogos[link.retailer] ?? {
            bg: "bg-cream-200/20 border-cream-300/20 hover:bg-cream-200/30",
            text: "text-bark-400",
            icon: "🛍️",
          };

          return (
            <a
              key={`${link.retailer}-${idx}`}
              href={link.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className={`flex items-center justify-between p-4 border rounded-xl transition-all duration-200 no-underline group ${style.bg}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{style.icon}</span>
                <div>
                  <span className={`text-sm font-semibold ${style.text}`}>
                    {link.retailer === "Amazon" ? "Buy on Amazon" : `Buy on ${link.retailer}`}
                  </span>
                  {link.retailer === "Amazon" && (
                    <p className="text-[10px] text-cream-600 mt-0.5">Free shipping with Prime</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {link.price && (
                  <span className="text-lg font-semibold text-bark-400">
                    ${link.price}
                  </span>
                )}
                <span className={`text-xs ${style.text} group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 font-medium`}>
                  Check Price <ExternalLink size={12} />
                </span>
              </div>
            </a>
          );
        })}
      </div>
      <p className="text-[9px] text-cream-600 mt-2 text-center">
        As an Amazon Associate, Perfumare earns from qualifying purchases.
      </p>
    </section>
  );
}
