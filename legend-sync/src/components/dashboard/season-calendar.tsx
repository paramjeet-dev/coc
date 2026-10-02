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
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
      {ROWS.map((row) => (
        <div key={row.key}>
          <dt className="text-sm text-ink-300">{row.label}</dt>
          <dd className="mt-0.5 font-mono text-base tabular-nums text-ink-100">{displayDate(dates[row.key])}</dd>
        </div>
      ))}
    </dl>
  );
}
