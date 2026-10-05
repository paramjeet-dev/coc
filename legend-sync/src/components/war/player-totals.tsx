import Link from "next/link";
import { tagToSlug } from "@/lib/api/tags";
import { formatPercent } from "@/lib/format";
import type { PlayerWarTotals } from "@/lib/war";

export function PlayerTotals({ rows }: { rows: PlayerWarTotals[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] text-left text-sm">
        <caption className="sr-only">Player totals across recent wars</caption>
        <thead className="text-ink-500">
          <tr className="border-b border-ink-800">
            <th scope="col" className="py-2 pr-3 font-medium">Player</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Wars</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Avg stars</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Triple rate</th>
            <th scope="col" className="py-2 text-right font-medium">Missed</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800 font-mono tabular-nums">
          {rows.map((r) => (
            <tr key={r.tag}>
              <th scope="row" className="py-2 pr-3 font-sans font-medium">
                <Link href={`/player/${tagToSlug(r.tag)}`} className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-gold-400">
                  {r.name}
                </Link>
              </th>
              <td className="py-2 pr-3 text-right text-ink-300">{r.wars}</td>
              <td className="py-2 pr-3 text-right text-gold-300">{r.attacks ? (r.stars / r.attacks).toFixed(2) : "n/a"}</td>
              <td className="py-2 pr-3 text-right">{formatPercent(r.attacks ? (r.triples / r.attacks) * 100 : null, 0)}</td>
              <td className={`py-2 text-right ${r.missed > 0 ? "text-ember-400" : "text-ink-500"}`}>{r.missed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
