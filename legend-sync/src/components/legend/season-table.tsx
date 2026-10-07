import Image from "next/image";
import { formatInt } from "@/lib/format";
import type { LegendSeasonRecord } from "@/lib/api/types";
import { seasonLabel } from "@/lib/legend";

export function SeasonTable({ seasons }: { seasons: LegendSeasonRecord[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <caption className="sr-only">Past Legend seasons</caption>
        <thead className="text-ink-500">
          <tr className="border-b border-ink-800">
            <th scope="col" className="py-2 pr-4 font-medium">Season</th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">Trophies</th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">Rank</th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">Attack wins</th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">Defense wins</th>
            <th scope="col" className="py-2 font-medium">Clan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800 font-mono tabular-nums">
          {seasons.map((s) => (
            <tr key={s.season}>
              <th scope="row" className="py-2.5 pr-4 font-sans font-medium text-ink-100">{seasonLabel(s.season)}</th>
              <td className="py-2.5 pr-4 text-right text-gold-300">{formatInt(s.trophies)}</td>
              <td className="py-2.5 pr-4 text-right">{formatInt(s.rank)}</td>
              <td className="py-2.5 pr-4 text-right">{formatInt(s.attackWins)}</td>
              <td className="py-2.5 pr-4 text-right">{formatInt(s.defenseWins)}</td>
              <td className="py-2.5 font-sans">
                <span className="flex items-center gap-2">
                  {s.clan?.badgeUrls?.small && (
                    <Image src={s.clan.badgeUrls.small} alt="" width={20} height={20} className="size-5" />
                  )}
                  <span className="truncate text-ink-300">{s.clan?.name ?? "No clan"}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
