import Image from "next/image";
import Link from "next/link";
import { StarMarks } from "@/components/legend/star-marks";
import { formatPercent } from "@/lib/format";
import { tagToSlug } from "@/lib/api/tags";
import { toNum, type WarSide } from "@/lib/api/types";
import { memberLines, type OurWar } from "@/lib/war";

function Scoreboard({ side, align }: { side: WarSide; align: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-4 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <Image src={side.badgeUrls.medium} alt="" width={56} height={56} className="size-14 shrink-0" unoptimized />
      <div className="min-w-0">
        <p className="truncate font-semibold">{side.name}</p>
        <p className="font-mono text-3xl font-semibold tabular-nums text-gold-300">{String(toNum(side.stars) ?? 0)}</p>
        <p className="font-mono text-xs tabular-nums text-ink-500">{formatPercent(toNum(side.destructionPercentage), 1)} destruction</p>
      </div>
    </div>
  );
}

export function WarDetail({ item }: { item: OurWar }) {
  const per = toNum(item.war.attacksPerMember) ?? 2;
  const lines = memberLines(item.us, per);
  const missedTotal = lines.reduce((s, l) => s + l.missed, 0);
  const modifier = item.war.battleModifier && item.war.battleModifier !== "none" ? item.war.battleModifier : null;

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Scoreboard side={item.us} align="left" />
        <span className="text-xs uppercase tracking-widest text-ink-500">vs</span>
        <Scoreboard side={item.them} align="right" />
      </div>
      {modifier && <p className="mt-3 text-xs text-ink-300">Battle modifier: {modifier}</p>}

      {lines.length === 0 ? (
        <p className="mt-6 text-sm text-ink-300">Member attacks were not stored for this war.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <caption className="sr-only">Attacks by member</caption>
            <thead className="text-ink-500">
              <tr className="border-b border-ink-800">
                <th scope="col" className="py-2 pr-3 font-medium">#</th>
                <th scope="col" className="py-2 pr-3 font-medium">Player</th>
                <th scope="col" className="py-2 pr-3 text-right font-medium">TH</th>
                {Array.from({ length: per }, (_, i) => (
                  <th key={i} scope="col" className="py-2 pr-3 font-medium">Attack {i + 1}</th>
                ))}
                <th scope="col" className="py-2 text-right font-medium">Stars taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800 font-mono tabular-nums">
              {lines.map((l) => (
                <tr key={l.tag}>
                  <td className="py-2 pr-3 text-ink-500">{l.position ?? ""}</td>
                  <th scope="row" className="py-2 pr-3 font-sans font-medium">
                    <Link href={`/player/${tagToSlug(l.tag)}`} className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-gold-400">
                      {l.name}
                    </Link>
                  </th>
                  <td className="py-2 pr-3 text-right text-ink-300">{l.townHall ?? ""}</td>
                  {Array.from({ length: per }, (_, i) => {
                    const a = l.attacks[i];
                    return (
                      <td key={i} className="py-2 pr-3">
                        {a ? (
                          <span className="flex items-center gap-2">
                            <StarMarks stars={toNum(a.stars) ?? 0} />
                            <span className="text-xs text-ink-300">{String(toNum(a.destructionPercentage) ?? 0)}%</span>
                          </span>
                        ) : (
                          <span className="text-xs font-sans text-ember-400">missed</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-2 text-right text-ink-300">{l.defenseStars ?? "n/a"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-ink-500">
            {missedTotal === 0 ? "Every attack was used." : `${missedTotal} attack${missedTotal === 1 ? "" : "s"} unused. "Stars taken" is the best attack the enemy landed on that base.`}
          </p>
        </div>
      )}
    </div>
  );
}
