import Link from "next/link";
import { formatInt } from "@/lib/format";
import { tagToSlug } from "@/lib/api/tags";
import { toNum, type ClanLegendRow } from "@/lib/api/types";

export function SeasonRoster({ rows }: { rows: ClanLegendRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <caption className="sr-only">Clan players in this Legend season</caption>
        <thead className="text-ink-500">
          <tr className="border-b border-ink-800">
            <th scope="col" className="py-2 pr-3 font-medium">#</th>
            <th scope="col" className="py-2 pr-3 font-medium">Player</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Attacks won</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Defenses held</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Global rank</th>
            <th scope="col" className="py-2 text-right font-medium">Trophies</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800 font-mono tabular-nums">
          {rows.map((r, i) => (
            <tr key={r.tag}>
              <td className="py-2 pr-3 text-ink-500">{i + 1}</td>
              <th scope="row" className="py-2 pr-3 font-sans font-medium">
                <Link href={`/player/${tagToSlug(r.tag)}`} className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-gold-400">
                  {r.name}
                </Link>
              </th>
              <td className="py-2 pr-3 text-right">{formatInt(r.attackWins)}</td>
              <td className="py-2 pr-3 text-right">{formatInt(r.defenseWins)}</td>
              <td className="py-2 pr-3 text-right text-ink-300">{(toNum(r.rank) ?? 0) > 0 ? `#${formatInt(r.rank)}` : "unranked"}</td>
              <td className="py-2 text-right text-gold-300">{formatInt(r.trophies)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
