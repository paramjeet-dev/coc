import { formatCompact, formatPercent } from "@/lib/format";
import { formatDuration } from "@/lib/legend";
import type { ModeSummary } from "@/lib/battlelog";

const LABEL: Record<ModeSummary["mode"], string> = { legend: "Legend", ranked: "Ranked", farming: "Farming" };

/** One lead tile for the busiest mode, with the others as a compact ledger beside it. */
export function ModeSummaryBlock({ summaries }: { summaries: ModeSummary[] }) {
  const active = summaries.filter((s) => s.attacks > 0).sort((a, b) => b.attacks - a.attacks);
  if (active.length === 0) return null;
  const [lead, ...rest] = active;

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="rounded-3xl bg-ink-800 p-6 sm:p-8 lg:col-span-5">
        <p className="text-sm text-ink-300">{LABEL[lead.mode]}, most active</p>
        <p className="mt-2 font-mono text-5xl font-semibold tabular-nums text-gold-300">{lead.attacks}</p>
        <p className="text-sm text-ink-300">attacks in this window</p>
        <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
          {[
            ["Triple rate", formatPercent(lead.tripleRate)],
            ["Destruction", formatPercent(lead.averageDestruction, 0)],
            ["Avg time", formatDuration(lead.averageDuration)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-ink-500">{label}</dt>
              <dd className="font-mono text-lg tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        {lead.mode === "farming" && (
          <p className="mt-5 font-mono text-xs text-ink-300">
            Looted {formatCompact(lead.gold)} gold, {formatCompact(lead.elixir)} elixir,{" "}
            {formatCompact(lead.darkElixir)} dark elixir
          </p>
        )}
      </div>
      <div className="rounded-2xl bg-ink-900 p-6 ring-1 ring-ink-800 lg:col-span-7">
        <table className="w-full text-sm">
          <caption className="sr-only">Attack summary by mode</caption>
          <thead className="text-left text-xs text-ink-500">
            <tr>
              <th scope="col" className="pb-2 font-normal">Mode</th>
              <th scope="col" className="pb-2 text-right font-normal">Attacks</th>
              <th scope="col" className="pb-2 text-right font-normal">Stars</th>
              <th scope="col" className="pb-2 text-right font-normal">Triples</th>
              <th scope="col" className="pb-2 text-right font-normal">Avg %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800 font-mono tabular-nums">
            {[lead, ...rest].map((s) => (
              <tr key={s.mode}>
                <th scope="row" className="py-2.5 text-left font-sans font-medium">{LABEL[s.mode]}</th>
                <td className="py-2.5 text-right">{s.attacks}</td>
                <td className="py-2.5 text-right">{s.stars}</td>
                <td className="py-2.5 text-right">{formatPercent(s.tripleRate, 0)}</td>
                <td className="py-2.5 text-right">{formatPercent(s.averageDestruction, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {summaries.some((s) => s.attacks === 0) && (
          <p className="mt-3 text-xs text-ink-500">
            Modes with no stored attacks are left out: {summaries.filter((s) => s.attacks === 0).map((s) => LABEL[s.mode]).join(", ") || "none"}.
          </p>
        )}
      </div>
    </div>
  );
}
