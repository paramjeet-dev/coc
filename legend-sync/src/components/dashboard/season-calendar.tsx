import type { CurrentDates } from "@/lib/api/types";
import { displayDate } from "@/lib/legend";

const ROWS: Array<{ key: keyof CurrentDates; label: string }> = [
  { key: "legend", label: "Legend day" },
  { key: "season", label: "Season" },
  { key: "raid", label: "Raid weekend" },
  { key: "clan-games", label: "Clan Games" },
];

export function SeasonCalendar({ dates }: { dates: CurrentDates | null }) {
  if (!dates) {
    return <p className="text-sm text-ink-300">Event dates are unavailable right now.</p>;
  }

  return (
    <dl className="grid grid-cols-2 gap-3">
      {ROWS.map((row) => (
        <div key={row.key} className="rounded-xl bg-ink-850 p-3 ring-1 ring-ink-800">
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-500">{row.label}</dt>
          <dd className="mt-1 font-mono text-sm tabular-nums text-ink-100">{displayDate(dates[row.key])}</dd>
        </div>
      ))}
    </dl>
  );
}
