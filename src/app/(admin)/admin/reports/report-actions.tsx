"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReportActions({ reportId, currentStatus }: { reportId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    setLoading(true);
    await fetch("/api/admin/reports", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reportId, status }),
    });
    router.refresh();
    setLoading(false);
  }

  if (currentStatus !== "pending") return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateStatus("resolved")}
        disabled={loading}
        className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
      >
        Resolve
      </button>
      <button
        onClick={() => updateStatus("dismissed")}
        disabled={loading}
        className="text-xs px-2 py-1 rounded bg-cream-400/20 text-cream-500 hover:bg-cream-400/30 transition-colors disabled:opacity-50"
      >
        Dismiss
      </button>
    </div>
  );
}
