import Image from "next/image";
import Link from "next/link";
import { StarMarks } from "@/components/legend/star-marks";
import { formatPercent } from "@/lib/format";
import { tagToSlug } from "@/lib/api/tags";
import { toNum, type WarSide } from "@/lib/api/types";
import { AssetIcon } from "@/components/ui/asset-icon";
import { townHallIcon } from "@/lib/assets";
import { RESULT_STYLE } from "./result-style";
import { WAR_KINDS, attacksPerMember, memberLines, type OurWar } from "@/lib/war";

function Scoreboard({ side, align }: { side: WarSide; align: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-4 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <Image src={side.badgeUrls.medium} alt="" width={56} height={56} className="size-14 shrink-0" unoptimized />
      <div className="min-w-0">
        <p className="truncate font-semibold">{side.name}</p>
        <p className="flex items-center gap-2 font-mono text-3xl font-semibold tabular-nums text-gold-300">
          <AssetIcon name="star" size={26} />
          {String(toNum(side.stars) ?? 0)}
        </p>
        <p className="font-mono text-xs tabular-nums text-ink-500">{formatPercent(toNum(side.destructionPercentage), 1)} destruction</p>
      </div>
    </div>
  );
}

function TownHallBadge({ level }: { level: number | null }) {
  const src = townHallIcon(level);
  if (!src || level === null) return <span className="block text-right text-ink-300">{level ?? ""}</span>;
  return (
    <span className="flex justify-end">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`Town Hall ${level}`} title={`Town Hall ${level}`} width={30} height={30} loading="lazy" className="size-[30px] object-contain" />
    </span>
  );
}

export function WarDetail({ item }: { item: OurWar }) {
  const per = attacksPerMember(item.war, item.kind);
  const lines = memberLines(item.us, per);
  const missedTotal = lines.reduce((s, l) => s + l.missed, 0);
  const modifier = item.war.battleModifier && item.war.battleModifier !== "none" ? item.war.battleModifier : null;

  return (
    <div>
      <div className={`rounded-2xl p-4 sm:p-5 ${RESULT_STYLE[item.result].row.split(" ")[0]}`}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-300">
          {RESULT_STYLE[item.result].headline}
        </p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Scoreboard side={item.us} align="left" />
        <span className="text-xs uppercase tracking-widest text-ink-500">vs</span>
        <Scoreboard side={item.them} align="right" />
      </div>
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-300">
        <span className="rounded-md bg-tide-400/15 px-2 py-0.5 font-medium text-tide-400">
          {WAR_KINDS.find((k) => k.value === item.kind)?.label}
        </span>
        {modifier && <span>Battle modifier: {modifier}</span>}
      </p>

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
                  <th key={i} scope="col" className="py-2 pr-3 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <AssetIcon name="attack" size={14} />
                      Attack {i + 1}
                    </span>
                  </th>
                ))}
                <th scope="col" className="py-2 text-right font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <AssetIcon name="defense" size={14} />
                    Stars taken
                  </span>
                </th>
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
                  <td className="py-2 pr-3">
                    <TownHallBadge level={l.townHall} />
                  </td>
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
                  <td className="py-2 text-right text-ink-300">
                    {l.defenseStars === null ? (
                      "n/a"
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        {l.defenseStars}
                        <AssetIcon name="star" size={13} />
                      </span>
                    )}
                  </td>
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
