"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface VoteData {
  longevity?: number;
  sillage?: string;
  priceValue?: number;
  season?: string;
  timeOfDay?: string;
}

interface VoteAggregation {
  totalVotes: number;
  longevity: number | null;
  sillage: Record<string, number> | null;
  priceValue: number | null;
  season: Record<string, number> | null;
  timeOfDay: Record<string, number> | null;
}

export function useVote(perfumeId: string) {
  const { data: session } = useSession();
  const [userVote, setUserVote] = useState<VoteData | null>(null);
  const [aggregated, setAggregated] = useState<VoteAggregation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAggregated = useCallback(async () => {
    try {
      const res = await fetch(`/api/votes?perfumeId=${perfumeId}`);
      const data = await res.json();
      setAggregated(data);
    } catch {
      // ignore
    }
  }, [perfumeId]);

  useEffect(() => {
    setIsLoading(true);
    fetchAggregated().finally(() => setIsLoading(false));
  }, [fetchAggregated]);

  const submit = useCallback(
    async (data: VoteData) => {
      if (!session?.user?.id) return;
      setIsLoading(true);

      try {
        const res = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ perfumeId, ...data }),
        });
        const vote = await res.json();
        setUserVote(vote);
        await fetchAggregated();
      } catch {
        // ignore
      }

      setIsLoading(false);
    },
    [session?.user?.id, perfumeId, fetchAggregated]
  );

  return { userVote, aggregated, isLoading, submit };
}
