import { CopyCode } from "./copy-code";
import { StarMarks } from "@/components/legend/star-marks";
import { ResourceAmount } from "@/components/ui/resource-amount";
import { formatPercent } from "@/lib/format";
import { formatDuration, parseBattleTime } from "@/lib/legend";
import { toNum, type BattleHistoryItem } from "@/lib/api/types";

const MODE_STYLE: Record<BattleHistoryItem["battleMode"], string> = {
  legend: "bg-gold-400/15 text-gold-300",
  ranked: "bg-tide-400/15 text-tide-400",
  farming: "bg-ink-700 text-ink-300",
};

function clock(time: string): string {
  return parseBattleTime(time).toISOString().slice(11, 16);
}

function Loot({ item }: { item: BattleHistoryItem }) {
  const { gold, elixir, darkElixir } = item.lootedResources ?? { gold: 0, elixir: 0, darkElixir: 0 };
  if (!gold && !elixir && !darkElixir) return null;
  return (
    <span className="flex items-center gap-3">
      {gold ? <ResourceAmount kind="gold" amount={gold} /> : null}
      {elixir ? <ResourceAmount kind="elixir" amount={elixir} /> : null}
      {darkElixir ? <ResourceAmount kind="darkElixir" amount={darkElixir} /> : null}
    </span>
  );
}

function dayLabel(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
}

type Props = { groups: Array<{ day: string; items: BattleHistoryItem[] }> };

export function BattleList({ groups }: Props) {
  return (
    <div className="space-y-7">
      {groups.map((group) => (
        <section key={group.day} aria-label={dayLabel(group.day)}>
          <h3 className="sticky top-0 z-10 flex items-baseline justify-between bg-ink-900/95 py-1.5 text-sm font-semibold backdrop-blur">
            <span>{dayLabel(group.day)}</span>
            <span className="font-mono text-xs font-normal tabular-nums text-ink-500">
              {group.items.length} {group.items.length === 1 ? "attack" : "attacks"}
            </span>
          </h3>
          <ul className="divide-y divide-ink-800">
            {group.items.map((item, i) => {
              return (
                <li
                  key={`${item.battleTime}-${i}`}
                  className="grid grid-cols-[3rem_4.5rem_1fr_auto] items-center gap-3 py-2.5 text-sm sm:grid-cols-[3rem_4.5rem_5rem_3.5rem_3.5rem_1fr_auto]"
                >
                  <span className="font-mono text-xs tabular-nums text-ink-500">{clock(item.battleTime)}</span>
                  <span className={`w-fit rounded-md px-2 py-0.5 text-xs font-medium capitalize ${MODE_STYLE[item.battleMode]}`}>
                    {item.battleMode}
                  </span>
                  <StarMarks stars={item.stars} />
                  <span className="hidden font-mono tabular-nums text-ink-300 sm:block">
                    {formatPercent(toNum(item.destructionPercentage), 0)}
                  </span>
                  <span className="hidden font-mono tabular-nums text-ink-300 sm:block">
                    {formatDuration(item.duration)}
                  </span>
                  <span className="hidden truncate font-mono text-xs text-ink-300 sm:block"><Loot item={item} /></span>
                  <span className="justify-self-end">
                    {item.shareCode ? (
                      <CopyCode code={item.shareCode} />
                    ) : (
                      <span className="text-xs text-ink-500">no code</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
