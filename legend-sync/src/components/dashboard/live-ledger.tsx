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

  const [lead, ...rest] = ROWS;
  if (!lead) return null;
  return (
    <div>
      <div className="rounded-xl bg-ink-850 p-4 ring-1 ring-gold-400/20">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-500">{lead.label}</p>
        <p className="mt-1 font-mono text-4xl font-semibold tabular-nums text-gold-300">
          {formatCompact(counts[lead.key])}
        </p>
      </div>
      <dl className="mt-2 divide-y divide-ink-800">
        {rest.map((row) => (
          <div key={row.key} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-sm text-ink-300">{row.label}</dt>
            <dd className="font-mono text-base tabular-nums text-ink-100">{formatCompact(counts[row.key])}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
