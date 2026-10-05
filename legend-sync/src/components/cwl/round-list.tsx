import Link from "next/link";
import Image from "next/image";
import { toNum } from "@/lib/api/types";
import type { OurRound } from "@/lib/cwl";

const RESULT = {
  win: "bg-gold-400/15 text-gold-300",
  loss: "bg-ember-400/15 text-ember-400",
  tie: "bg-ink-700 text-ink-300",
} as const;

type Props = { rounds: OurRound[]; basePath: string; season: string; selected: number };

export function RoundList({ rounds, basePath, season, selected }: Props) {
  return (
    <ol className="space-y-1">
      {rounds.map(({ number, war }) => {
        const active = number === selected;
        const content = war ? (
          <>
            <Image src={war.them.badgeUrls.small} alt="" width={28} height={28} className="size-7 shrink-0" unoptimized />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{war.them.name}</span>
              <span className="block text-xs text-ink-500">
                {war.war.state === "warEnded" ? "Finished" : war.war.state === "inWar" ? "In progress" : "Preparation"}
              </span>
            </span>
            <span className="text-right">
              {war.war.state === "warEnded" && (
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium capitalize ${RESULT[war.result]}`}>{war.result}</span>
              )}
              <span className="mt-1 block font-mono text-xs tabular-nums text-ink-300">
                {String(toNum(war.us.stars) ?? 0)}-{String(toNum(war.them.stars) ?? 0)}
              </span>
            </span>
          </>
        ) : (
          <span className="text-sm text-ink-500">Round not started or not stored</span>
        );
        const cls = `flex items-center gap-3 rounded-xl px-3 py-2.5 ${active ? "bg-ink-800 ring-1 ring-gold-600" : ""}`;
        return (
          <li key={number}>
            <p className="px-3 pt-2 font-mono text-[11px] uppercase tracking-wider text-ink-500">Round {number}</p>
            {war ? (
              <Link
                href={`${basePath}?season=${encodeURIComponent(season)}&round=${number}`}
                scroll={false}
                aria-current={active ? "true" : undefined}
                className={`${cls} outline-none hover:bg-ink-800/70 focus-visible:ring-2 focus-visible:ring-gold-400`}
              >
                {content}
              </Link>
            ) : (
              <div className={cls}>{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
