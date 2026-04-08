import { cn } from "@/lib/utils";

interface AccordItem {
  name: string;
  color: string;
  intensity: number;
}

interface AccordBarsProps {
  accords: AccordItem[];
  className?: string;
}

export function AccordBars({ accords, className }: AccordBarsProps) {
  const sorted = [...accords].sort((a, b) => b.intensity - a.intensity);

  return (
    <section className={cn("space-y-3", className)}>
      <h3 className="section-title mb-4">Main Accords</h3>
      {sorted.map((accord) => (
        <div key={accord.name} className="flex items-center gap-3">
          <span className="text-sm text-bark-400 w-24 text-right shrink-0">
            {accord.name}
          </span>
          <div className="flex-1 h-5 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${accord.intensity}%`,
                backgroundColor: accord.color,
              }}
            />
          </div>
          <span className="text-xs text-cream-500 w-8">
            {accord.intensity}%
          </span>
        </div>
      ))}
    </section>
  );
}
