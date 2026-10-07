import type { Metadata } from "next";
import { AttackDefenseChart } from "@/components/legend/attack-defense-chart";
import { AttackStrip } from "@/components/legend/attack-strip";
import { DayInspector } from "@/components/legend/day-inspector";
import { SeasonHistoryChart } from "@/components/legend/season-history-chart";
import { SeasonTable } from "@/components/legend/season-table";
import { TrophyTideChart } from "@/components/legend/trophy-tide-chart";
import { Panel } from "@/components/ui/panel";
import {
  getBattlelogHistory,
  getLegendDayBattlelog,
  getLegendHistory,
  getLegendSeries,
} from "@/lib/api/endpoints";
import { normalizeTag } from "@/lib/api/tags";
import { formatPercent } from "@/lib/format";
import {
  compareSeasons,
  dayKey,
  formatDuration,
  groupLegendAttacks,
  runningTotal,
  seasonLabel,
  summarizeAttacks,
  trimInactive,
} from "@/lib/legend";

export const metadata: Metadata = { title: "Legends history" };

const MS_DAY = 86_400_000;

function signed(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}

export const dynamic = "force-dynamic";

export default async function PlayerLegendsPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ day?: string }>;
}) {
  const { tag: slug } = await params;
  const { day } = await searchParams;
  const tag = normalizeTag(slug);
  const after = new Date(Date.now() - 31 * MS_DAY).toISOString();

  const [series, history, battles] = await Promise.allSettled([
    getLegendSeries(tag),
    getLegendHistory(tag),
    getBattlelogHistory(tag, after),
  ]);

  const allDays =
    series.status === "fulfilled"
      ? [...series.value.items].sort((a, b) => dayKey(a.day).localeCompare(dayKey(b.day)))
      : [];
  const days = trimInactive(allDays);
  const keys = days.map((d) => dayKey(d.day));

  const seasons =
    history.status === "fulfilled"
      ? [...history.value.items].sort((a, b) => compareSeasons(b.season, a.season))
      : [];
  const battleItems = battles.status === "fulfilled" ? battles.value.items : [];

  const attacksByDay = groupLegendAttacks(battleItems);
  const summary = summarizeAttacks(battleItems);

  const selectedKey = day && keys.includes(day) ? day : keys[keys.length - 1];
  const selectedRaw = days.find((d) => dayKey(d.day) === selectedKey)?.day;
  const dayLog = selectedRaw
    ? await getLegendDayBattlelog(tag, selectedRaw).catch(() => null)
    : null;

  const basePath = `/player/${slug.toUpperCase().replace(/^#/, "")}/legends`;

  if (days.length === 0 && seasons.length === 0) {
    return (
      <Panel className="rounded-2xl p-8">
        <h2 className="text-xl font-semibold tracking-tight">No Legend data for this player yet</h2>
        <p className="mt-2 max-w-prose text-ink-300">
          Legend history appears once the tracker has seen this player in Legend League. Check the
          tag, or come back after their next Legend day.
        </p>
      </Panel>
    );
  }

  const tide = runningTotal(days);
  const net = days.map((d) => ({
    day: dayKey(d.day),
    attack: Math.abs(d.attackTrophies),
    defense: -Math.abs(d.defenseTrophies),
  }));
  const netTotal = days.reduce((sum, d) => sum + d.trophies, 0);

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      {days.length > 0 && (
        <>
          <Panel
            title="Recent tide"
            description="Running net trophies across your recent Legend days."
            className="rounded-panel p-6 sm:p-8 lg:col-span-8"
          >
            {tide.length > 1 ? (
              <TrophyTideChart data={tide} />
            ) : (
              <p className="text-sm text-ink-300">Two Legend days are needed to draw the tide.</p>
            )}
          </Panel>

          <Panel title="Recent form" className="rounded-tile p-6 lg:col-span-4 lg:self-start">
            <dl className="divide-y divide-ink-800">
              {[
                ["Net trophies", signed(netTotal)],
                ["Legend days", String(days.length)],
                ["Attacks tracked", String(summary.attacks)],
                ["Triple rate", formatPercent(summary.tripleRate)],
                ["No star rate", formatPercent(summary.zeroRate)],
                ["Average destruction", formatPercent(summary.averageDestruction)],
                ["Average attack time", formatDuration(summary.averageDuration)],
              ].map(([label, value], i) => (
                <div key={label} className="flex items-baseline justify-between py-2.5">
                  <dt className="text-sm text-ink-300">{label}</dt>
                  <dd
                    className={`font-mono tabular-nums ${
                      i === 0 ? "text-xl font-semibold text-gold-300" : "text-base"
                    }`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel
            title="Attack strip"
            description="One column per day, one dot per attack. Pick a day to inspect it."
            className="rounded-3xl p-6 sm:p-8 lg:col-span-7"
          >
            <AttackStrip
              days={keys}
              attacksByDay={attacksByDay}
              selectedDay={selectedKey}
              basePath={basePath}
            />
          </Panel>

          <Panel
            title="Gains against losses"
            description="Trophies won attacking, trophies lost defending."
            className="rounded-2xl p-6 lg:col-span-5"
          >
            <AttackDefenseChart data={net} />
          </Panel>

          {selectedKey && (
            <Panel title={`Day ${selectedKey}`} className="rounded-3xl p-6 sm:p-8 lg:col-span-12">
              {dayLog ? (
                <DayInspector log={dayLog} />
              ) : (
                <p className="text-sm text-ink-300">Battle details for this day could not be loaded.</p>
              )}
            </Panel>
          )}
        </>
      )}

      {seasons.length > 0 && (
        <>
          <Panel
            title="Season finishes"
            description="Final trophies in each past Legend season."
            className="rounded-tile p-6 lg:col-span-5"
          >
            <SeasonHistoryChart
              data={[...seasons].reverse().map((s) => ({
                season: seasonLabel(s.season),
                trophies: typeof s.trophies === "number" ? s.trophies : 0,
              }))}
            />
          </Panel>
          <Panel title="Season ledger" className="rounded-2xl p-6 lg:col-span-7">
            <SeasonTable seasons={seasons.slice(0, 12)} />
          </Panel>
        </>
      )}
    </div>
  );
}
