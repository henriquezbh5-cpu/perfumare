"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Menu, X, User, LogOut, Settings, Search } from "lucide-react";
import { SearchBar } from "./search-bar";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

const navKeys = [
  { key: "perfumes", href: "/perfumes" },
  { key: "brands", href: "/brands" },
  { key: "notes", href: "/notes" },
  { key: "perfumers", href: "/perfumers" },
  { key: "finder", href: "/finder" },
  { key: "compare", href: "/compare" },
  { key: "bestOf", href: "/best" },
  { key: "community", href: "/community" },
  { key: "magazine", href: "/magazine" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("nav");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled && "shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
      )}
    >
      {/* Single compact bar — always visible */}
      <div className="bg-cream-50/80 backdrop-blur-xl border-b border-cream-300/10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="no-underline shrink-0">
              <span className="text-xl font-serif tracking-wide text-shimmer">
                Perfumare
              </span>
            </Link>

            {/* Desktop nav — center */}
            <ul className="hidden lg:flex items-center gap-5">
              {navKeys.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-[11px] font-medium uppercase tracking-widest transition-colors whitespace-nowrap no-underline relative py-1",
                        isActive
                          ? "text-gold-500"
                          : "text-bark-300 hover:text-gold-500"
                      )}
                    >
                      {t(link.key)}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-500 rounded-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right side — language + search + auth */}
            <div className="flex items-center gap-3">
              {/* Language switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-bark-300 hover:text-gold-500 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Auth */}
              {session?.user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-400/30 flex items-center justify-center overflow-hidden">
                      {session.user.image ? (
                        <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-medium text-gold-400">
                          {getInitials(session.user.name ?? session.user.email ?? "U")}
                        </span>
                      )}
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-cream-100/95 backdrop-blur-xl rounded-lg shadow-card-hover border border-cream-300/20 py-1 z-50">
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-bark-400 hover:bg-cream-200/30 no-underline">
                        <User size={14} /> {t("profile")}
                      </Link>
                      <Link href="/profile?tab=settings" className="flex items-center gap-2 px-4 py-2 text-sm text-bark-400 hover:bg-cream-200/30 no-underline">
                        <Settings size={14} /> {t("settings")}
                      </Link>
                      <div className="h-px bg-cream-300/20 my-1" />
                      <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 px-4 py-2 text-sm text-bark-400 hover:bg-cream-200/30 w-full text-left">
                        <LogOut size={14} /> {t("signOut")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="text-xs text-bark-300 hover:text-gold-500 transition-colors no-underline">
                  {t("signIn")}
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-bark-400 hover:text-gold-500 transition-colors"
                aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search dropdown */}
      {searchOpen && (
        <div className="bg-cream-50/95 backdrop-blur-xl border-b border-cream-300/10">
          <div className="mx-auto max-w-lg px-4 py-3">
            <SearchBar />
          </div>
        </div>
      )}

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-cream-50/95 backdrop-blur-xl border-b border-cream-300/10">
          <ul className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            {navKeys.map((link) => {
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
                        ? "text-gold-500 bg-gold-500/10"
                        : "text-bark-300 hover:text-gold-500 hover:bg-cream-200/20"
                    )}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* Language switcher in mobile */}
          <div className="px-4 pb-3 sm:hidden">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
