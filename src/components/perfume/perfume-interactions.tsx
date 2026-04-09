"use client";

import { useState, useCallback } from "react";
import { WardrobeButtons } from "./wardrobe-buttons";
import { ReviewModal } from "./review-modal";
import { VoteModal } from "./vote-modal";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { useVote } from "@/hooks/use-vote";
import { PerformanceVotes } from "./performance-votes";
import { SeasonTime } from "./season-time";
import { PenLine, BarChart3 } from "lucide-react";

interface PerfumeInteractionsProps {
  perfumeId: string;
  perfumeName: string;
}

export function PerfumeWardrobeSection({ perfumeId }: { perfumeId: string }) {
  return <WardrobeButtons perfumeId={perfumeId} />;
}

export function PerfumeReviewButton({
  perfumeId,
  perfumeName,
  onReviewAdded,
}: {
  perfumeId: string;
  perfumeName: string;
  onReviewAdded?: () => void;
}) {
  const [showReview, setShowReview] = useState(false);

  return (
    <AuthGuard>
      <>
        <Button size="lg" className="w-full gap-2" onClick={() => setShowReview(true)}>
          <PenLine size={16} />
          Write a Review
        </Button>
        <ReviewModal
          isOpen={showReview}
          onClose={() => setShowReview(false)}
          perfumeId={perfumeId}
          perfumeName={perfumeName}
          onSuccess={() => {
            onReviewAdded?.();
            window.location.reload();
          }}
        />
      </>
    </AuthGuard>
  );
}

export function PerfumeReviewSectionButton({
  perfumeId,
  perfumeName,
}: PerfumeInteractionsProps) {
  const [showReview, setShowReview] = useState(false);

  return (
    <AuthGuard>
      <>
        <Button size="md" className="gap-2" onClick={() => setShowReview(true)}>
          <PenLine size={14} />
          Write a Review
        </Button>
        <ReviewModal
          isOpen={showReview}
          onClose={() => setShowReview(false)}
          perfumeId={perfumeId}
          perfumeName={perfumeName}
          onSuccess={() => window.location.reload()}
        />
      </>
    </AuthGuard>
  );
}

export function PerfumePerformanceSection({
  perfumeId,
  perfumeName,
}: PerfumeInteractionsProps) {
  const [showVote, setShowVote] = useState(false);
  const { aggregated, isLoading, submit } = useVote(perfumeId);

  const handleVoteSubmit = useCallback(
    async (data: { longevity?: number; sillage?: string; priceValue?: number; season?: string; timeOfDay?: string }) => {
      await submit(data);
    },
    [submit]
  );

  // Get top sillage from aggregation
  const topSillage = aggregated?.sillage
    ? Object.entries(aggregated.sillage).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A"
    : "N/A";

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">Performance</h3>
        <AuthGuard>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowVote(true)}
          >
            <BarChart3 size={14} />
            Vote
          </Button>
        </AuthGuard>
      </div>

      {isLoading ? (
        <p className="text-center text-bark-200 py-4">Loading performance data...</p>
      ) : aggregated?.totalVotes && aggregated.totalVotes > 0 ? (
        <PerformanceVotes
          longevity={aggregated?.longevity ?? 0}
          sillage={topSillage}
          priceValue={aggregated?.priceValue ?? 0}
        />
      ) : (
        <div className="text-center py-6 rounded-xl border border-cream-300/10 bg-cream-100/5">
          <BarChart3 size={28} className="mx-auto mb-2 text-cream-400" strokeWidth={1.2} />
          <p className="text-sm text-cream-500 mb-1">No votes yet</p>
          <p className="text-xs text-cream-600">Be the first to rate this fragrance&apos;s performance</p>
        </div>
      )}

      {/* Season & Time from aggregation */}
      {aggregated && (aggregated.season || aggregated.timeOfDay) && (
        <section className="mt-8">
          <h3 className="section-title mb-6 text-center">When to Wear</h3>
          <SeasonTime
            season={{
              spring: aggregated.season?.spring ?? 25,
              summer: aggregated.season?.summer ?? 25,
              fall: aggregated.season?.fall ?? 25,
              winter: aggregated.season?.winter ?? 25,
            }}
            time={{
              day: aggregated.timeOfDay?.day ?? 50,
              night: aggregated.timeOfDay?.night ?? 50,
            }}
          />
        </section>
      )}

      <VoteModal
        isOpen={showVote}
        onClose={() => setShowVote(false)}
        perfumeId={perfumeId}
        perfumeName={perfumeName}
        onSubmit={handleVoteSubmit}
      />
    </>
  );
}
