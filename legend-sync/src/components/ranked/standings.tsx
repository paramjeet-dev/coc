import Link from "next/link";
import { formatInt } from "@/lib/format";
import { tagToSlug } from "@/lib/api/tags";
import { groupLeaders } from "@/lib/ranked";
import type { RankedGroupMember } from "@/lib/api/types";

export function Standings({ members, playerTag }: { members: RankedGroupMember[]; playerTag: string }) {
  const sorted = groupLeaders(members);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] text-left text-sm">
        <caption className="sr-only">Group standings</caption>
        <thead className="text-ink-500">
          <tr className="border-b border-ink-800">
            <th scope="col" className="py-2 pr-3 font-medium">#</th>
            <th scope="col" className="py-2 pr-3 font-medium">Player</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">TH</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Atk W/L</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Def W/L</th>
            <th scope="col" className="py-2 text-right font-medium">Trophies</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800 font-mono tabular-nums">
          {sorted.map((m) => {
            const me = m.tag === playerTag;
            return (
              <tr key={m.tag} className={me ? "bg-gold-400/10" : undefined}>
                <td className="py-2 pr-3 text-ink-500">{m.placement}</td>
                <th scope="row" className="py-2 pr-3 font-sans font-medium">
                  <Link
                    href={`/player/${tagToSlug(m.tag)}/ranked`}
                    className={`outline-none hover:underline focus-visible:ring-2 focus-visible:ring-gold-400 ${me ? "text-gold-300" : "text-ink-100"}`}
                  >
                    {m.name}
                  </Link>
                </th>
                <td className="py-2 pr-3 text-right text-ink-300">{m.townHallLevel ?? "n/a"}</td>
                <td className="py-2 pr-3 text-right">{m.attackWins}/{m.attackLosses}</td>
                <td className="py-2 pr-3 text-right">{m.defenseWins}/{m.defenseLosses}</td>
                <td className="py-2 text-right text-gold-300">{formatInt(m.leagueTrophies)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
