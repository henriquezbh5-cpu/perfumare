import Link from "next/link";
import { Button } from "@/components/ui/button";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Perfumes", href: "/perfumes" },
      { label: "Brands", href: "/brands" },
      { label: "Notes", href: "/notes" },
      { label: "Perfumers", href: "/perfumers" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Finder", href: "/finder" },
      { label: "Compare", href: "/compare" },
      { label: "Top Rated", href: "/perfumes?sort=rating" },
      { label: "New Releases", href: "/perfumes?sort=newest" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Forums", href: "/community" },
      { label: "Reviews", href: "/reviews" },
      { label: "Magazine", href: "/magazine" },
      { label: "Members", href: "/members" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
];

function SocialIcon({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={name}
      className="w-9 h-9 rounded-full bg-bark-400 flex items-center justify-center text-cream-300 hover:bg-gold-500 hover:text-white transition-colors no-underline"
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-bark-500 text-cream-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Brand + newsletter */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-xl text-white mb-2">
              1000PerfumesNight
            </h3>
            <p className="text-sm text-cream-500 leading-relaxed mb-6">
              The ultimate fragrance encyclopedia. Discover, compare, and review
              thousands of perfumes from around the world.
            </p>

            {/* Newsletter signup (visual only) */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-gold-400 mb-3">
                Newsletter
              </h4>
              <p className="text-xs text-cream-500 mb-3">
                Get weekly fragrance picks and reviews
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-md bg-bark-400 border border-bark-300 px-3 py-2 text-sm text-cream-200 placeholder:text-cream-600 focus:outline-none focus:ring-1 focus:ring-gold-400"
                  disabled
                />
                <Button size="sm" className="shrink-0" disabled>
                  Subscribe
                </Button>
              </div>
              <p className="text-[10px] text-cream-600 mt-1.5">
                Coming soon
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              <SocialIcon name="Instagram">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </SocialIcon>
              <SocialIcon name="X / Twitter">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon name="Facebook">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.07 1.373.14v3.324c-.149-.016-.408-.024-.732-.024-1.04 0-1.44.394-1.44 1.42v2.698h3.888l-.668 3.667h-3.22v8.27C19.396 22.15 23 17.541 23 12.068 23 5.982 18.075 1.068 12 1.068S1 5.982 1 12.068c0 5.002 3.657 9.152 8.101 10.623z" />
                </svg>
              </SocialIcon>
              <SocialIcon name="YouTube">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </SocialIcon>
              <SocialIcon name="TikTok">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-medium uppercase tracking-widest text-gold-400 mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream-400 hover:text-white transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-bark-400">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-cream-500">
            &copy; {new Date().getFullYear()} 1000PerfumesNight. All rights
            reserved.
          </p>
          <p className="text-xs text-cream-600">
            Built with passion for fragrance lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
