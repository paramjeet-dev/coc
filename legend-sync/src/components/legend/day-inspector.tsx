import Link from "next/link";
import { CopyCode } from "@/components/battlelog/copy-code";
import { tagToSlug } from "@/lib/api/tags";
import { formatDuration, parseBattleTime } from "@/lib/legend";
import { formatPercent } from "@/lib/format";
import { toNum, type LegendBattle, type LegendDayBattlelog } from "@/lib/api/types";
import { AssetIcon } from "@/components/ui/asset-icon";
import { ArmyDetails } from "@/components/army/army-breakdown";
import { StarMarks } from "./star-marks";

function clock(time: string): string {
  return parseBattleTime(time).toISOString().slice(11, 16);
}

function signed(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}

function BattleRow({ battle, side }: { battle: LegendBattle; side: "attack" | "defense" }) {
  const pct = Math.max(0, Math.min(100, toNum(battle.destructionPercentage) ?? 0));
  const verb = side === "attack" ? "Attacked" : "Defended against";

  return (
    <li className="py-3.5 text-sm">
      <div className="flex items-start gap-3">
        <span className="w-[3.25rem] shrink-0 pt-0.5 font-mono text-xs tabular-nums text-ink-500">
          {clock(battle.time)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              href={`/player/${tagToSlug(battle.opponent.tag)}/legends`}
              className="truncate font-medium outline-none hover:text-gold-300 focus-visible:text-gold-300"
            >
              <span className="sr-only">{verb} </span>
              {battle.opponent.name}
            </Link>
          </div>
          <p className="mt-0.5 truncate font-mono text-xs text-ink-500">
            {battle.opponent.tag}
          </p>
        </div>
        <span
          className={`shrink-0 text-right font-mono text-base font-semibold tabular-nums ${
            side === "attack" ? "text-tide-400" : "text-ember-400"
          }`}
        >
          {signed(battle.trophies)}
        </span>
      </div>

      <div className="ml-[3.75rem] mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-300">
        <StarMarks stars={battle.stars} />
        <span className="font-mono tabular-nums">{formatPercent(pct, 0)}</span>
        {battle.duration > 0 && (
          <span
            className="flex items-center gap-1.5 font-mono tabular-nums"
            title="Attack duration"
            aria-label={`Duration ${formatDuration(battle.duration)}`}
          >
            <AssetIcon name="clock" size={14} />
            {formatDuration(battle.duration)}
          </span>
        )}
        {battle.shareCode && <CopyCode code={battle.shareCode} label="Copy army code" />}
      </div>
      {battle.shareCode && <ArmyDetails code={battle.shareCode} className="ml-[3.75rem] mt-3" />}
    </li>
  );
}

function isBattle(entry: LegendDayBattlelog["defenses"][number]): entry is LegendBattle {
  return "opponent" in entry;
}

export function DayInspector({ log }: { log: LegendDayBattlelog }) {
  const defenses = log.defenses.filter(isBattle);
  const automatic = log.defenses.length - defenses.length;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section aria-labelledby="attacks-heading">
        <div className="flex items-baseline justify-between">
          <h3 id="attacks-heading" className="flex items-center gap-2 text-base font-semibold">
            <AssetIcon name="attack" size={20} />
            Attacks
          </h3>
          <span className="font-mono text-sm tabular-nums text-tide-400">
            {signed(log.attackTrophies)}
          </span>
        </div>
        {log.attacks.length === 0 ? (
          <p className="mt-3 text-sm text-ink-300">No attacks were recorded for this day.</p>
        ) : (
          <ul className="mt-2 divide-y divide-ink-800">
            {log.attacks.map((battle, i) => (
              <BattleRow key={`${battle.time}-${i}`} battle={battle} side="attack" />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="defenses-heading">
        <div className="flex items-baseline justify-between">
          <h3 id="defenses-heading" className="flex items-center gap-2 text-base font-semibold">
            <AssetIcon name="defense" size={20} />
            Defenses
          </h3>
          <span className="font-mono text-sm tabular-nums text-ember-400">
            {signed(log.defenseTrophies)}
          </span>
        </div>
        {defenses.length === 0 ? (
          <p className="mt-3 text-sm text-ink-300">No defenses were recorded for this day.</p>
        ) : (
          <ul className="mt-2 divide-y divide-ink-800">
            {defenses.map((battle, i) => (
              <BattleRow key={`${battle.time}-${i}`} battle={battle} side="defense" />
            ))}
          </ul>
        )}
        {automatic > 0 && (
          <p className="mt-3 text-xs text-ink-500">
            {automatic} automatic {automatic === 1 ? "defense was" : "defenses were"} counted without a battle.
          </p>
        )}
      </section>
    </div>
  );
}
