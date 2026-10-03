import Link from "next/link";
import Image from "next/image";
import { leagueTierIcon } from "@/lib/assets";
import { formatInt } from "@/lib/format";
import type { RankedSeasonRecord } from "@/lib/api/types";

type Props = { seasons: RankedSeasonRecord[]; selected: string; basePath: string };

/** A scrolling list of ranked seasons. Picking one reloads the page with ?season=. */
export function SeasonTrail({ seasons, selected, basePath }: Props) {
  return (
    <nav aria-label="Ranked seasons">
      <ol className="max-h-[28rem] space-y-1 overflow-y-auto pr-1">
        {seasons.map((s) => {
          const active = s.seasonId === selected;
          return (
            <li key={s.seasonId}>
              <Link
                href={`${basePath}?season=${encodeURIComponent(s.seasonId)}`}
                scroll={false}
                aria-current={active ? "true" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none ${
                  active ? "bg-ink-800 ring-1 ring-gold-600" : "hover:bg-ink-800/70"
                }`}
              >
                <Image src={leagueTierIcon(s.league.name)} alt="" width={32} height={32} className="size-8 shrink-0" unoptimized />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{s.seasonId}</span>
                  <span className="block truncate text-xs text-ink-500">{s.league.name}</span>
                </span>
                <span className="text-right">
                  <span className="block font-mono text-sm tabular-nums text-gold-300">{formatInt(s.leagueTrophies)}</span>
                  <span className="block font-mono text-xs tabular-nums text-ink-500">#{s.placement}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
