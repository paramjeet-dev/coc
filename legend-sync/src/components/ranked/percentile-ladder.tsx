import type { LeagueTierStatistics } from "@/lib/api/types";
import { formatInt } from "@/lib/format";

const STEPS = ["p10", "p25", "p50", "p75", "p90"] as const;

/** A horizontal ladder of tier percentiles with the player's trophies placed on it. */
export function PercentileLadder({
  trophies,
  percentiles,
}: {
  trophies: number;
  percentiles: LeagueTierStatistics["trophyPercentiles"];
}) {
  const points = STEPS.flatMap((k) => (percentiles[k] === null ? [] : [{ key: k, value: percentiles[k] as number }]));
  if (points.length < 2) return null;

  const min = Math.min(points[0].value, trophies);
  const max = Math.max(points[points.length - 1].value, trophies);
  const span = Math.max(max - min, 1);
  const at = (v: number) => `${((v - min) / span) * 100}%`;

  return (
    <div>
      <div className="relative mx-3 mt-10 mb-12 h-1.5 rounded-full bg-ink-700">
        {points.map((p) => (
          <div key={p.key} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: at(p.value) }}>
            <span className="block size-2.5 rotate-45 rounded-[2px] bg-ink-500" />
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-center font-mono text-[11px] tabular-nums text-ink-300">
              <span className="block text-ink-500">{p.key}</span>
              {formatInt(p.value)}
            </span>
          </div>
        ))}
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: at(trophies) }}>
          <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gold-400 px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-ink-950">
            {formatInt(trophies)}
          </span>
          <span className="block size-4 rotate-45 rounded-[3px] bg-gold-400 ring-4 ring-ink-900" />
        </div>
      </div>
    </div>
  );
}
