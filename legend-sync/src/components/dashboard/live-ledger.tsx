import { formatCompact } from "@/lib/format";
import type { GlobalCounts } from "@/lib/api/types";

const ROWS: Array<{ key: keyof GlobalCounts; label: string }> = [
  { key: "players_in_legends", label: "Players in Legend League" },
  { key: "players_in_war", label: "Players in war right now" },
  { key: "clans_in_war", label: "Clans in war right now" },
  { key: "player_count", label: "Players tracked" },
  { key: "clan_count", label: "Clans tracked" },
  { key: "wars_stored", label: "Wars stored" },
];

export function LiveLedger({ counts }: { counts: GlobalCounts | null }) {
  if (!counts) {
    return (
      <p className="text-sm text-ink-300">
        Live counts are unavailable. The tracker may be catching up, refresh in a minute.
      </p>
    );
  }

  return (
    <dl className="divide-y divide-ink-800">
      {ROWS.map((row, index) => (
        <div key={row.key} className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-sm text-ink-300">{row.label}</dt>
          <dd
            className={`font-mono tabular-nums ${
              index === 0 ? "text-2xl font-semibold text-gold-300" : "text-lg text-ink-100"
            }`}
          >
            {formatCompact(counts[row.key])}
          </dd>
        </div>
      ))}
    </dl>
  );
}
