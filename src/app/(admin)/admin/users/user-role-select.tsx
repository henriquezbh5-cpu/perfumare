"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserRoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateRole(role: string) {
    setLoading(true);
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, role }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <select
      value={currentRole}
      onChange={(e) => updateRole(e.target.value)}
      disabled={loading}
      className="text-xs px-2 py-1 rounded bg-cream-100/20 border border-cream-300/20 text-bark-400 focus:outline-none focus:border-gold-500/50 disabled:opacity-50"
    >
      <option value="user">User</option>
      <option value="moderator">Moderator</option>
      <option value="admin">Admin</option>
    </select>
  );
}
