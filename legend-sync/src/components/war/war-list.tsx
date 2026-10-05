import Link from "next/link";
import Image from "next/image";
import { formatPercent } from "@/lib/format";
import { toNum } from "@/lib/api/types";
import type { OurWar } from "@/lib/war";

const RESULT: Record<OurWar["result"], { label: string; style: string }> = {
  win: { label: "Win", style: "bg-gold-400/15 text-gold-300" },
  loss: { label: "Loss", style: "bg-ember-400/15 text-ember-400" },
  tie: { label: "Tie", style: "bg-ink-700 text-ink-300" },
};

function endDate(time: string): string {
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(time);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : time;
}

type Props = { wars: OurWar[]; basePath: string; selected: string };

export function WarList({ wars, basePath, selected }: Props) {
  return (
    <ol className="max-h-[30rem] space-y-1 overflow-y-auto pr-1">
      {wars.map((w) => {
        const active = w.slug === selected;
        const r = RESULT[w.result];
        return (
          <li key={w.slug}>
            <Link
              href={`${basePath}?war=${encodeURIComponent(w.slug)}`}
              scroll={false}
              aria-current={active ? "true" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                active ? "bg-ink-800 ring-1 ring-gold-600" : "hover:bg-ink-800/70"
              }`}
            >
              <Image src={w.them.badgeUrls.small} alt="" width={28} height={28} className="size-7 shrink-0" unoptimized />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{w.them.name}</span>
                <span className="block font-mono text-xs tabular-nums text-ink-500">
                  {endDate(w.war.endTime)}, {String(toNum(w.war.teamSize) ?? "?")}v{String(toNum(w.war.teamSize) ?? "?")}
                </span>
              </span>
              <span className="text-right">
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${r.style}`}>{r.label}</span>
                <span className="mt-1 block font-mono text-xs tabular-nums text-ink-300">
                  {String(toNum(w.us.stars) ?? 0)}-{String(toNum(w.them.stars) ?? 0)}
                  <span className="text-ink-500"> {formatPercent(toNum(w.us.destructionPercentage), 0)}</span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
