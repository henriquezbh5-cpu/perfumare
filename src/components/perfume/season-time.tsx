import { cn } from "@/lib/utils";

interface SeasonVote {
  spring: number;
  summer: number;
  fall: number;
  winter: number;
}

interface TimeVote {
  day: number;
  night: number;
}

interface SeasonTimeProps {
  season: SeasonVote;
  time: TimeVote;
  className?: string;
}

const seasonData = [
  { key: "spring" as const, label: "Spring", emoji: "\ud83c\udf38" },
  { key: "summer" as const, label: "Summer", emoji: "\u2600\ufe0f" },
  { key: "fall" as const, label: "Fall", emoji: "\ud83c\udf42" },
  { key: "winter" as const, label: "Winter", emoji: "\u2744\ufe0f" },
];

const timeData = [
  { key: "day" as const, label: "Day", emoji: "\ud83c\udf1e" },
  { key: "night" as const, label: "Night", emoji: "\ud83c\udf19" },
];

function VoteItem({
  emoji,
  label,
  percentage,
  isTop,
}: {
  emoji: string;
  label: string;
  percentage: number;
  isTop: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 p-3 rounded-lg transition-colors",
        isTop ? "bg-gold-50 border border-gold-300" : "bg-cream-50"
      )}
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-xs font-medium text-bark-400">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          isTop ? "text-gold-500" : "text-cream-500"
        )}
      >
        {percentage}%
      </span>
    </div>
  );
}

export function SeasonTime({ season, time, className }: SeasonTimeProps) {
  const maxSeason = Math.max(season.spring, season.summer, season.fall, season.winter);
  const maxTime = Math.max(time.day, time.night);

  return (
    <section className={cn("space-y-6", className)}>
      {/* Seasons */}
      <div>
        <h4 className="text-xs font-medium uppercase tracking-widest text-cream-500 mb-3 text-center">
          Best Season
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {seasonData.map((s) => (
            <VoteItem
              key={s.key}
              emoji={s.emoji}
              label={s.label}
              percentage={season[s.key]}
              isTop={season[s.key] === maxSeason}
            />
          ))}
        </div>
      </div>

      {/* Time */}
      <div>
        <h4 className="text-xs font-medium uppercase tracking-widest text-cream-500 mb-3 text-center">
          Best Time
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {timeData.map((t) => (
            <VoteItem
              key={t.key}
              emoji={t.emoji}
              label={t.label}
              percentage={time[t.key]}
              isTop={time[t.key] === maxTime}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
