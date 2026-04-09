"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

type WardrobeStatus = "have" | "want" | "had" | null;

export function useWardrobe(perfumeId: string) {
  const { data: session } = useSession();
  const [status, setStatus] = useState<WardrobeStatus>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) {
      setStatus(null);
      return;
    }

    fetch(`/api/wardrobe?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => {
        const item = data.items?.find(
          (i: { perfume: { slug: string } }) => i.perfume?.slug === perfumeId
        );
        setStatus(item?.status ?? null);
      })
      .catch(() => setStatus(null));
  }, [session?.user?.id, perfumeId]);

  const toggle = useCallback(
    async (newStatus: "have" | "want" | "had") => {
      if (!session?.user?.id) return;
      setIsLoading(true);

      const previousStatus = status;

      if (status === newStatus) {
        // Remove from wardrobe
        setStatus(null);
        try {
          await fetch(`/api/wardrobe?perfumeId=${perfumeId}`, { method: "DELETE" });
        } catch {
          setStatus(previousStatus);
        }
      } else {
        // Add or update
        setStatus(newStatus);
        try {
          await fetch("/api/wardrobe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ perfumeId, status: newStatus }),
          });
        } catch {
          setStatus(previousStatus);
        }
      }

      setIsLoading(false);
    },
    [session?.user?.id, perfumeId, status]
  );

  const remove = useCallback(async () => {
    if (!session?.user?.id) return;
    setStatus(null);
    await fetch(`/api/wardrobe?perfumeId=${perfumeId}`, { method: "DELETE" });
  }, [session?.user?.id, perfumeId]);

  return { status, isLoading, toggle, remove };
}
