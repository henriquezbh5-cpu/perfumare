interface RatingHistogramProps {
  reviews: { rating: number }[];
}

export function RatingHistogram({ reviews }: RatingHistogramProps) {
  if (reviews.length === 0) return null;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="space-y-1.5">
      {distribution.map(({ star, count }) => {
        const percentage = (count / maxCount) * 100;
        const pctOfTotal = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;

        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-4 text-right text-cream-500 text-xs">{star}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-gold-500 shrink-0">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div className="flex-1 h-2.5 bg-cream-200/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500 rounded-full transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs text-cream-600">{pctOfTotal}%</span>
          </div>
        );
      })}
    </div>
  );
}
