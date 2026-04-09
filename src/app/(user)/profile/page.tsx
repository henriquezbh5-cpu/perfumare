"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { WardrobeTab } from "@/components/profile/wardrobe-tab";
import { ReviewsTab } from "@/components/profile/reviews-tab";
import { SettingsTab } from "@/components/profile/settings-tab";
import { getInitials } from "@/lib/utils";

const profileTabs = [
  { key: "wardrobe", label: "Wardrobe" },
  { key: "reviews", label: "Reviews" },
  { key: "settings", label: "Settings" },
];

function ProfileContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") ?? "wardrobe";

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-bark-200">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const user = session?.user;

  const handleTabChange = (tab: string) => {
    router.push(`/profile?tab=${tab}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gold-500/10 border-2 border-gold-400/30 flex items-center justify-center overflow-hidden">
          {user?.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-serif text-gold-500">
              {getInitials(user?.name ?? user?.email ?? "U")}
            </span>
          )}
        </div>
        <div>
          <h1 className="font-serif text-2xl text-bark-500 text-glow">
            {user?.name ?? user?.username ?? "Perfume Enthusiast"}
          </h1>
          {user?.username && (
            <p className="text-sm text-bark-200">@{user.username}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={profileTabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "wardrobe" && <WardrobeTab />}
        {activeTab === "reviews" && <ReviewsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-bark-200">Loading...</p>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
