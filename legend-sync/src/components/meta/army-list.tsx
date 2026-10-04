import Link from "next/link";
import { formatInt, formatPercent } from "@/lib/format";
import { toNum, type ArmyFamily, type Cohort } from "@/lib/api/types";
import { describeFamily, tripleRate, usageShare, zeroStarRate, type SortKey, type WindowDays } from "@/lib/meta";
import { formatDuration } from "@/lib/legend";

type Props = { armies: ArmyFamily[]; cohort: Cohort; sort: SortKey; window: WindowDays; selected?: string };

export function ArmyList({ armies, cohort, sort, window, selected }: Props) {
  if (armies.length === 0) {
    return <p className="text-sm text-ink-300">No army families meet the minimum for this window. Try a longer window or a wider cohort.</p>;
  }
  const topUse = Math.max(...armies.map((a) => usageShare(a) ?? 0), 1);

  return (
    <ol className="divide-y divide-ink-800">
      {armies.map((a, i) => {
        const active = a.shareCode === selected;
        const share = usageShare(a);
        const q = new URLSearchParams({ cohort, sort, window: String(window), army: a.shareCode });
        return (
          <li key={a.familyId}>
            <Link
              href={`/meta?${q.toString()}`}
              scroll={false}
              aria-current={active ? "true" : undefined}
              className={`block rounded-xl px-3 py-3.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none ${
                active ? "bg-ink-800" : "hover:bg-ink-800/60"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex min-w-0 items-baseline gap-2.5">
                  <span className="font-mono text-xs tabular-nums text-ink-500">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate font-medium">{describeFamily(a)}</span>
                </span>
                <span className="shrink-0 font-mono text-lg font-semibold tabular-nums text-gold-300">
                  {formatPercent(tripleRate(a.starCounts), 0)}
                  <span className="ml-1 text-xs font-normal text-ink-500">triples</span>
                </span>
              </div>
              <div
                className="mt-2 h-1 rounded-full bg-ink-700"
                role="img"
                aria-label={`${formatPercent(share)} of Legend attacks`}
              >
                <div className="h-full rounded-full bg-tide-400" style={{ width: `${((share ?? 0) / topUse) * 100}%` }} />
              </div>
              <dl className="mt-2.5 grid grid-cols-4 gap-2 text-xs">
                {[
                  ["Share", formatPercent(share)],
                  ["Attacks", formatInt(a.attacks)],
                  ["Zero star", formatPercent(zeroStarRate(a.starCounts), 0)],
                  ["Avg time", formatDuration(toNum(a.averageDuration) ?? 0)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-ink-500">{label}</dt>
                    <dd className="font-mono tabular-nums text-ink-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
