"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SearchBar } from "./search-bar";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Perfumes", href: "/perfumes" },
  { label: "Brands", href: "/brands" },
  { label: "Notes", href: "/notes" },
  { label: "Perfumers", href: "/perfumers" },
  { label: "Finder", href: "/finder" },
  { label: "Compare", href: "/compare" },
  { label: "Community", href: "/community" },
  { label: "Magazine", href: "/magazine" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-shadow duration-300",
        scrolled && "shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
      )}
    >
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
            <Link
              href="/login"
              className="hover:text-white transition-colors text-cream-300 no-underline"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="hover:text-white transition-colors text-cream-300 no-underline"
            >
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
          {/* Desktop nav */}
          <ul className="hidden md:flex items-center justify-center gap-6 py-3">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-xs font-medium uppercase tracking-widest transition-colors whitespace-nowrap no-underline relative py-1",
                      isActive
                        ? "text-gold-500"
                        : "text-bark-300 hover:text-gold-500"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gold-500 rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center justify-between py-3">
            <span className="text-xs font-medium uppercase tracking-widest text-bark-300">
              Menu
            </span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-bark-400 hover:text-gold-500 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-cream-200">
            <ul className="mx-auto max-w-7xl px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block text-sm font-medium py-2 px-3 rounded-md transition-colors no-underline",
                        isActive
                          ? "text-gold-500 bg-gold-50"
                          : "text-bark-300 hover:text-gold-500 hover:bg-cream-50"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
