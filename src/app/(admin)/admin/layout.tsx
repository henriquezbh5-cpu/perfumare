import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { LayoutDashboard, Droplets, Building2, FileText, Users, Flag, Database } from "lucide-react";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Perfumes", href: "/admin/perfumes", icon: Droplets },
  { label: "Brands", href: "/admin/brands", icon: Building2 },
  { label: "Articles", href: "/admin/articles", icon: FileText },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reports", href: "/admin/reports", icon: Flag },
  { label: "Seed", href: "/admin/seed", icon: Database },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-cream-100/50 backdrop-blur-lg border-r border-cream-300/10 p-4">
        <div className="mb-6">
          <h2 className="font-serif text-lg text-shimmer">Admin</h2>
          <p className="text-xs text-cream-600">Perfumare Management</p>
        </div>
        <nav className="space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-bark-300 hover:text-gold-500 hover:bg-cream-200/20 transition-colors no-underline"
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
