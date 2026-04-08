import { cn } from "@/lib/utils";

interface PerformanceVotesProps {
  longevity: number;
  sillage: string;
  priceValue: number;
  className?: string;
}

const sillageScale = ["Intimate", "Moderate", "Strong", "Enormous"];

function Metric({
  label,
  value,
  maxValue,
  displayValue,
  description,
}: {
  label: string;
  value: number;
  maxValue: number;
  displayValue: string;
  description: string;
}) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="text-center">
      <h4 className="text-xs font-medium uppercase tracking-widest text-cream-500 mb-2">
        {label}
      </h4>
      <div className="text-3xl font-serif text-bark-500 mb-2">
        {displayValue}
      </div>
      <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden mb-1">
        <div
          className="h-full bg-gold-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-cream-500">{description}</span>
    </div>
  );
}

export function PerformanceVotes({
  longevity,
  sillage,
  priceValue,
  className,
}: PerformanceVotesProps) {
  const sillageIndex = sillageScale.indexOf(sillage);
  const sillageValue = sillageIndex >= 0 ? sillageIndex + 1 : 2;

  return (
    <section className={cn("", className)}>
      <h3 className="section-title mb-6 text-center">Performance</h3>
      <div className="grid grid-cols-3 gap-6">
        <Metric
          label="Longevity"
          value={longevity}
          maxValue={10}
          displayValue={longevity.toFixed(1)}
          description={longevity >= 7 ? "Long lasting" : longevity >= 4 ? "Moderate" : "Short"}
        />
        <Metric
          label="Sillage"
          value={sillageValue}
          maxValue={4}
          displayValue={sillage}
          description={`${sillageValue} of 4`}
        />
        <Metric
          label="Price Value"
          value={priceValue}
          maxValue={5}
          displayValue={priceValue.toFixed(1)}
          description={priceValue >= 4 ? "Great value" : priceValue >= 2.5 ? "Fair" : "Overpriced"}
        />
      </div>
    </section>
  );
}
