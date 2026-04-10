export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 w-48 bg-cream-200/20 rounded-lg" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-cream-300/10 overflow-hidden">
            <div className="aspect-[3/4] bg-cream-200/10" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 bg-cream-200/15 rounded" />
              <div className="h-3 w-1/2 bg-cream-200/10 rounded" />
              <div className="h-3 w-1/3 bg-cream-200/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
