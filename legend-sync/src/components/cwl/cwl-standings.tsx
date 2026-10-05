import Image from "next/image";
import Link from "next/link";
import { formatInt } from "@/lib/format";
import { tagToSlug } from "@/lib/api/tags";
import type { Standing } from "@/lib/cwl";

export function CwlStandings({ rows, tag }: { rows: Standing[]; tag: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <caption className="sr-only">League group standings</caption>
        <thead className="text-ink-500">
          <tr className="border-b border-ink-800">
            <th scope="col" className="py-2 pr-3 font-medium">#</th>
            <th scope="col" className="py-2 pr-3 font-medium">Clan</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">W-L-T</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Stars</th>
            <th scope="col" className="py-2 text-right font-medium">Destruction</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800 font-mono tabular-nums">
          {rows.map((r, i) => {
            const me = r.clan.tag === tag;
            return (
              <tr key={r.clan.tag} className={me ? "bg-gold-400/10" : undefined}>
                <td className="py-2 pr-3 text-ink-500">{i + 1}</td>
                <th scope="row" className="py-2 pr-3 font-sans font-medium">
                  <Link href={`/war/${tagToSlug(r.clan.tag)}/cwl`} className="flex items-center gap-2.5 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-gold-400">
                    <Image src={r.clan.badgeUrls.small} alt="" width={24} height={24} className="size-6 shrink-0" unoptimized />
                    <span className={me ? "text-gold-300" : undefined}>{r.clan.name}</span>
                  </Link>
                </th>
                <td className="py-2 pr-3 text-right">{r.wins}-{r.losses}-{r.ties}</td>
                <td className="py-2 pr-3 text-right text-gold-300">{formatInt(r.stars)}</td>
                <td className="py-2 text-right text-ink-300">{formatInt(Math.round(r.destruction))}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
