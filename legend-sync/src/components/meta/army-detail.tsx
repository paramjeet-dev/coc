import { CopyCode } from "@/components/battlelog/copy-code";
import { ArmyTimelineChart } from "./army-timeline-chart";
import { formatInt, formatPercent } from "@/lib/format";
import { formatDuration } from "@/lib/legend";
import { toNum, type ArmyFamily, type ArmyTimeline } from "@/lib/api/types";
import { describeFamily, timelineSeries, totalAttacks, tripleRate, usageShare } from "@/lib/meta";

const STAR_ROWS = [
  ["three", "3 stars"],
  ["two", "2 stars"],
  ["one", "1 star"],
  ["zero", "0 stars"],
] as const;

export function ArmyDetail({ family, timeline }: { family: ArmyFamily; timeline: ArmyTimeline | null }) {
  const n = totalAttacks(family.starCounts);
  const series = timeline ? timelineSeries(timeline.items) : [];

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-semibold tracking-tight">{describeFamily(family)}</h3>
          <p className="mt-1 font-mono text-xs text-ink-500">{family.shareCode.slice(0, 28)}{family.shareCode.length > 28 ? "..." : ""}</p>
        </div>
        <CopyCode code={family.shareCode} label="Copy army code" />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-sm sm:grid-cols-4">
        {[
          ["Triple rate", formatPercent(tripleRate(family.starCounts))],
          ["Usage share", formatPercent(usageShare(family))],
          ["Players", family.players === null ? "n/a" : formatInt(family.players)],
          ["Avg time", formatDuration(toNum(family.averageDuration) ?? 0)],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-ink-500">{label}</dt>
            <dd className="font-mono text-lg tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <h4 className="text-sm font-semibold">Star outcomes</h4>
        <ul className="mt-2 space-y-1.5">
          {STAR_ROWS.map(([key, label]) => {
            const count = family.starCounts[key];
            const pct = n > 0 ? (count / n) * 100 : 0;
            return (
              <li key={key} className="grid grid-cols-[4rem_1fr_6rem] items-center gap-3 text-xs">
                <span className="text-ink-300">{label}</span>
                <span className="h-2 rounded-full bg-ink-800">
                  <span
                    className={`block h-full rounded-full ${key === "three" ? "bg-gold-400" : "bg-ink-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="text-right font-mono tabular-nums text-ink-300">
                  {formatInt(count)} <span className="text-ink-500">{formatPercent(pct, 0)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold">Day by day</h4>
        {series.length > 1 ? (
          <>
            <ArmyTimelineChart data={series} />
            <p className="mt-1 text-xs text-ink-500">Solid line is triple rate, dashed is share of all Legend attacks.</p>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-300">Not enough days of data to draw a trend.</p>
        )}
      </div>
    </div>
  );
}
