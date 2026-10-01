import { formatInt } from "@/lib/format";
import type { LegendTrophyBucket } from "@/lib/api/types";

const MAX_BARS = 48;

/** Merge neighbouring buckets so the chart never draws more than MAX_BARS columns. */
function condense(buckets: LegendTrophyBucket[]): LegendTrophyBucket[] {
  const sorted = [...buckets].sort((a, b) => a.minimumTrophies - b.minimumTrophies);
  if (sorted.length <= MAX_BARS) return sorted;

  const size = Math.ceil(sorted.length / MAX_BARS);
  const merged: LegendTrophyBucket[] = [];
  for (let i = 0; i < sorted.length; i += size) {
    const slice = sorted.slice(i, i + size);
    const first = slice[0];
    const last = slice[slice.length - 1];
    if (!first || !last) continue;
    merged.push({
      minimumTrophies: first.minimumTrophies,
      maximumTrophies: last.maximumTrophies,
      playerCount: slice.reduce((sum, b) => sum + b.playerCount, 0),
    });
  }
  return merged;
}

export function TrophyHistogram({ buckets }: { buckets: LegendTrophyBucket[] }) {
  const bars = condense(buckets);
  const peak = Math.max(1, ...bars.map((b) => b.playerCount));
  const lowest = bars[0]?.minimumTrophies;
  const highest = bars[bars.length - 1]?.maximumTrophies;

  if (bars.length === 0) {
    return (
      <p className="rounded-tile bg-ink-800 p-6 text-sm text-ink-300">
        The trophy spread is not available yet. It refreshes every few minutes.
      </p>
    );
  }

  return (
    <figure>
      <div
        role="img"
        aria-label={`Players per trophy range, from ${lowest} to ${highest} trophies`}
        className="flex h-52 items-end gap-[3px]"
      >
        {bars.map((bar) => (
          <div
            key={bar.minimumTrophies}
            title={`${formatInt(bar.minimumTrophies)} to ${formatInt(bar.maximumTrophies)} trophies: ${formatInt(bar.playerCount)} players`}
            className="min-h-[2px] flex-1 rounded-t-[3px] bg-gold-400/80 hover:bg-gold-300"
            style={{ height: `${Math.max(1, (bar.playerCount / peak) * 100)}%` }}
          />
        ))}
      </div>
      <figcaption className="mt-3 flex justify-between font-mono text-xs tabular-nums text-ink-500">
        <span>{formatInt(lowest)}</span>
        <span>trophies</span>
        <span>{formatInt(highest)}</span>
      </figcaption>
    </figure>
  );
}
