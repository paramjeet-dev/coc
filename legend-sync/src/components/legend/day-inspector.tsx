import { formatDuration, parseBattleTime } from "@/lib/legend";
import { formatPercent } from "@/lib/format";
import { toNum, type LegendBattle, type LegendDayBattlelog } from "@/lib/api/types";
import { AssetIcon } from "@/components/ui/asset-icon";
import { StarMarks } from "./star-marks";

function clock(time: string): string {
  return parseBattleTime(time).toISOString().slice(11, 16);
}

function signed(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}

function BattleRow({ battle, side }: { battle: LegendBattle; side: "attack" | "defense" }) {
  return (
    <li className="grid grid-cols-[3.25rem_1fr_auto] items-center gap-3 py-2.5 text-sm sm:grid-cols-[3.25rem_1fr_5rem_4.5rem_3.5rem_3.5rem]">
      <span className="font-mono text-xs tabular-nums text-ink-500">{clock(battle.time)}</span>
      <span className="min-w-0">
        <span className="block truncate font-medium">{battle.opponent.name}</span>
        <span className="block text-xs text-ink-500">Town Hall {battle.opponent.townHallLevel}</span>
      </span>
      <StarMarks stars={battle.stars} />
      <span className="hidden font-mono tabular-nums text-ink-300 sm:block">
        {formatPercent(toNum(battle.destructionPercentage), 0)}
      </span>
      <span className="hidden font-mono tabular-nums text-ink-300 sm:block">
        {formatDuration(battle.duration)}
      </span>
      <span
        className={`text-right font-mono tabular-nums ${
          side === "attack" ? "text-tide-400" : "text-ember-400"
        }`}
      >
        {signed(battle.trophies)}
      </span>
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
            {log.attacks.map((battle) => (
              <BattleRow key={battle.time} battle={battle} side="attack" />
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
            {defenses.map((battle) => (
              <BattleRow key={battle.time} battle={battle} side="defense" />
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
