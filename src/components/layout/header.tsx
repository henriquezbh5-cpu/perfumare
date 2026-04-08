import Link from "next/link";
import { SearchBar } from "./search-bar";

const navLinks = [
  { label: "Perfumes", href: "/perfumes" },
  { label: "Brands", href: "/brands" },
  { label: "Notes", href: "/notes" },
  { label: "Perfumers", href: "/perfumers" },
  { label: "Finder", href: "/search" },
  { label: "Community", href: "/community" },
  { label: "Magazine", href: "/magazine" },
  { label: "Compare", href: "/compare" },
];

export function Header() {
  return (
    <header>
      {/* Top bar */}
      <div className="bg-bark-500 text-cream-300 text-xs">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-2">
            <button className="hover:text-white transition-colors px-1.5 py-0.5 rounded text-xs font-medium">
              EN
            </button>
            <span className="text-bark-300">|</span>
            <button className="hover:text-white transition-colors px-1.5 py-0.5 rounded text-xs font-medium">
              ES
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-white transition-colors text-cream-300 no-underline">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-white transition-colors text-cream-300 no-underline">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Logo section */}
      <div className="bg-cream-100 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="section-title mb-2">The Fragrance Encyclopedia</p>
          <h1 className="text-3xl md:text-4xl font-serif text-bark-500 tracking-wide">
            1000PerfumesNight
          </h1>
          <div className="gold-divider mt-3" />
          <div className="mt-4 max-w-md mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-cream-300">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex items-center justify-center gap-6 py-3 overflow-x-auto">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-medium uppercase tracking-widest text-bark-300 hover:text-gold-500 transition-colors whitespace-nowrap no-underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
