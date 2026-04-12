// Multi-retailer affiliate link generator
// Each retailer has a search URL pattern and affiliate tag

export interface RetailerConfig {
  name: string;
  slug: string;
  icon: string;
  color: string;
  bgClass: string;
  searchUrl: (query: string, tag: string) => string;
  tagEnvVar: string;
  defaultTag: string;
  tagNote: string;
  subtitle: string;
}

export const RETAILERS: RetailerConfig[] = [
  {
    name: "Amazon",
    slug: "amazon",
    icon: "🛒",
    color: "#FF9900",
    bgClass: "bg-[#FF9900]/10 border-[#FF9900]/30 hover:bg-[#FF9900]/20",
    searchUrl: (q, tag) =>
      `https://www.amazon.com/s?k=${encodeURIComponent(q)}&i=beauty&tag=${tag}`,
    tagEnvVar: "NEXT_PUBLIC_AMAZON_TAG",
    defaultTag: "perfumare-20",
    tagNote: "Amazon Associates",
    subtitle: "Free shipping with Prime",
  },
  {
    name: "FragranceNet",
    slug: "fragrancenet",
    icon: "🌿",
    color: "#2D8B4E",
    bgClass: "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20",
    searchUrl: (q, tag) =>
      `https://www.fragrancenet.com/search?q=${encodeURIComponent(q)}&utm_source=affiliate&utm_medium=${tag}`,
    tagEnvVar: "NEXT_PUBLIC_FRAGRANCENET_TAG",
    defaultTag: "perfumare",
    tagNote: "FragranceNet Affiliate",
    subtitle: "Up to 80% off retail",
  },
  {
    name: "FragranceX",
    slug: "fragrancex",
    icon: "💎",
    color: "#1E3A5F",
    bgClass: "bg-blue-600/10 border-blue-600/30 hover:bg-blue-600/20",
    searchUrl: (q, tag) =>
      `https://www.fragrancex.com/search?q=${encodeURIComponent(q)}&utm_source=${tag}`,
    tagEnvVar: "NEXT_PUBLIC_FRAGRANCEX_TAG",
    defaultTag: "perfumare",
    tagNote: "FragranceX Affiliate",
    subtitle: "Discount fragrances",
  },
  {
    name: "Notino",
    slug: "notino",
    icon: "💧",
    color: "#00A3E0",
    bgClass: "bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20",
    searchUrl: (q, tag) =>
      `https://www.notino.com/search/?q=${encodeURIComponent(q)}&utm_source=${tag}`,
    tagEnvVar: "NEXT_PUBLIC_NOTINO_TAG",
    defaultTag: "perfumare",
    tagNote: "Notino Affiliate",
    subtitle: "Trusted European retailer",
  },
  {
    name: "eBay",
    slug: "ebay",
    icon: "🏷️",
    color: "#E53238",
    bgClass: "bg-red-500/10 border-red-500/30 hover:bg-red-500/20",
    searchUrl: (q, tag) =>
      `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}&_sacat=180345&mkcid=1&mkrid=711-53200-19255-0&campid=${tag}`,
    tagEnvVar: "NEXT_PUBLIC_EBAY_TAG",
    defaultTag: "5339126812",
    tagNote: "eBay Partner Network",
    subtitle: "New & used options",
  },
];

/**
 * Generate affiliate links for a perfume across all retailers
 */
export function generateAffiliateLinks(
  brandName: string,
  perfumeName: string,
  concentration: string
): { retailer: string; url: string; icon: string; color: string; bgClass: string; subtitle: string }[] {
  const query = `${brandName} ${perfumeName} ${concentration} perfume`;

  // For now, only show Amazon — other retailers will be added later
  const amazon = RETAILERS.find((r) => r.slug === "amazon")!;
  const tag = (typeof process !== "undefined" && process.env?.[amazon.tagEnvVar]) || amazon.defaultTag;
  return [
    {
      retailer: amazon.name,
      url: amazon.searchUrl(query, tag),
      icon: amazon.icon,
      color: amazon.color,
      bgClass: amazon.bgClass,
      subtitle: amazon.subtitle,
    },
  ];
}
