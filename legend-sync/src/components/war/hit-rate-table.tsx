import { formatInt, formatPercent } from "@/lib/format";
import type { ThHitRate } from "@/lib/war";

/** Same Town Hall hit rates, with a bar for triple rate so levels compare at a glance. */
export function HitRateTable({ rows }: { rows: ThHitRate[] }) {
  if (rows.length === 0) return <p className="text-sm text-ink-300">Not enough stored attacks in this window yet.</p>;
  const max = Math.max(...rows.map((r) => r.tripleRate), 1);
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">War hit rates by Town Hall</caption>
      <thead className="text-left text-xs text-ink-500">
        <tr className="border-b border-ink-800">
          <th scope="col" className="py-2 pr-3 font-medium">Town Hall</th>
          <th scope="col" className="py-2 pr-3 font-medium">Triple rate</th>
          <th scope="col" className="py-2 pr-3 text-right font-medium">Avg stars</th>
          <th scope="col" className="py-2 text-right font-medium">Attacks</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-ink-800 font-mono tabular-nums">
        {rows.map((r) => (
          <tr key={r.townHall}>
            <th scope="row" className="py-2.5 pr-3 text-left font-sans font-medium">TH{r.townHall}</th>
            <td className="py-2.5 pr-3">
              <span className="flex items-center gap-3">
                <span className="w-12 text-right">{formatPercent(r.tripleRate, 0)}</span>
                <span className="h-2 w-full max-w-40 rounded-full bg-ink-800">
                  <span className="block h-full rounded-full bg-gold-400" style={{ width: `${(r.tripleRate / max) * 100}%` }} />
                </span>
              </span>
            </td>
            <td className="py-2.5 pr-3 text-right">{r.averageStars.toFixed(2)}</td>
            <td className="py-2.5 text-right text-ink-300">{formatInt(r.attacks)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
