import type { Metadata } from "next";
import Link from "next/link";
import { Users, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Groups",
  description:
    "Join thematic fragrance groups. Connect with Oud lovers, budget seekers, Arabian fragrance enthusiasts and more.",
};

const groups = [
  {
    name: "Oud Lovers",
    slug: "oud-lovers",
    description:
      "For those who appreciate the deep, complex world of oud-based fragrances. Share discoveries, compare ouds, and discuss the finest oud houses.",
    members: 342,
    threads: 89,
    icon: "\ud83d\udd4c",
  },
  {
    name: "Budget Arabian Finds",
    slug: "budget-arabian",
    description:
      "Discover high-quality Arabian fragrances that don't break the bank. Clones, dupes, and hidden gems under $30.",
    members: 518,
    threads: 156,
    icon: "\ud83d\udcb0",
  },
  {
    name: "Niche Collectors",
    slug: "niche-collectors",
    description:
      "A group for serious collectors of niche and artisanal fragrances. Discuss limited editions, rare finds, and house exclusives.",
    members: 267,
    threads: 73,
    icon: "\u2728",
  },
  {
    name: "Fragrance Beginners",
    slug: "fragrance-beginners",
    description:
      "New to the fragrance world? This is your safe space to ask questions, get recommendations, and learn the basics.",
    members: 891,
    threads: 234,
    icon: "\ud83c\udf31",
  },
  {
    name: "Perfume DIY & Decanting",
    slug: "diy-decanting",
    description:
      "Everything about decanting, splitting bottles, and even making your own fragrances at home.",
    members: 145,
    threads: 42,
    icon: "\ud83e\uddea",
  },
  {
    name: "Seasonal Rotations",
    slug: "seasonal-rotations",
    description:
      "Share your seasonal rotation, get suggestions for the best summer freshies or winter warmers.",
    members: 410,
    threads: 112,
    icon: "\ud83c\udf43",
  },
];

export default function CommunityGroupsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <nav className="text-sm text-cream-500 mb-4">
          <Link
            href="/community"
            className="hover:text-gold-500 no-underline text-cream-500"
          >
            Community
          </Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-bark-400">Groups</span>
        </nav>
        <h1 className="text-3xl font-serif text-bark-500 text-glow">Groups</h1>
        <p className="text-bark-200 mt-2">
          Join thematic groups to connect with like-minded fragrance enthusiasts.
        </p>
      </div>

      {/* Groups grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div
            key={group.slug}
            className="glass-card p-6 hover:shadow-card-hover transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl shrink-0">{group.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg text-bark-500 group-hover:text-gold-500 transition-colors">
                  {group.name}
                </h3>
                <p className="text-sm text-bark-200 mt-1 line-clamp-2">
                  {group.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-cream-600">
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {group.members} members
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={12} /> {group.threads} threads
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-cream-300/10">
              <button className="text-xs font-medium text-gold-500 hover:text-gold-400 transition-colors uppercase tracking-wider">
                Join Group
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon note */}
      <div className="text-center py-8">
        <p className="text-sm text-cream-500">
          More groups coming soon. Have an idea?{" "}
          <Link
            href="/contact"
            className="text-gold-500 hover:text-gold-400 no-underline"
          >
            Suggest a group
          </Link>
        </p>
      </div>
    </div>
  );
}
