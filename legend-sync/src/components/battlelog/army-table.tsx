import Link from "next/link";
import { CopyCode } from "./copy-code";
import { formatPercent } from "@/lib/format";
import { formatDuration } from "@/lib/legend";
import type { ArmyUsage } from "@/lib/battlelog";

function shorten(code: string): string {
  return code.length > 22 ? `${code.slice(0, 10)}...${code.slice(-8)}` : code;
}

export function ArmyTable({ armies }: { armies: ArmyUsage[] }) {
  if (armies.length === 0) {
    return <p className="text-sm text-ink-300">No army codes were stored for these attacks.</p>;
  }
  return (
    <ul className="divide-y divide-ink-800">
      {armies.map((army, i) => (
        <li key={army.shareCode} className="py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-baseline gap-2.5">
              <span className="font-mono text-xs tabular-nums text-ink-500">{String(i + 1).padStart(2, "0")}</span>
              <span className="truncate font-mono text-sm" title={army.shareCode}>
                {shorten(army.shareCode)}
              </span>
            </div>
            <CopyCode code={army.shareCode} />
          </div>
          <dl className="mt-2 grid grid-cols-4 gap-2 text-xs">
            {[
              ["Used", String(army.uses)],
              ["Triples", `${army.triples}/${army.uses}`],
              ["Destruction", formatPercent(army.averageDestruction, 0)],
              ["Avg time", formatDuration(army.averageDuration)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-ink-500">{label}</dt>
                <dd className="font-mono tabular-nums text-ink-100">{value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={`/meta?army=${encodeURIComponent(army.shareCode)}`}
            className="mt-2 inline-block text-xs text-tide-400 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            See how the field performs with it
          </Link>
        </li>
      ))}
    </ul>
  );
}
