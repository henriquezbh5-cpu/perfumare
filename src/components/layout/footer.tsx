import Link from "next/link";

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
      { label: "Finder", href: "/search" },
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

export function Footer() {
  return (
    <footer className="bg-bark-500 text-cream-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Brand + Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-xl text-white mb-2">
              1000PerfumesNight
            </h3>
            <p className="text-sm text-cream-500 leading-relaxed">
              The ultimate fragrance encyclopedia. Discover, compare, and review
              thousands of perfumes from around the world.
            </p>
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
            &copy; {new Date().getFullYear()} 1000PerfumesNight. All rights reserved.
          </p>
          <p className="text-xs text-cream-600">
            Built with passion for fragrance lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
