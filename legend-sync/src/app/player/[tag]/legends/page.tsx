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
  getSeasonBounds,
} from "@/lib/api/endpoints";
import { normalizeTag } from "@/lib/api/tags";
import { formatPercent } from "@/lib/format";
import { formatDuration, groupLegendAttacks, summarizeAttacks } from "@/lib/legend";

export const metadata: Metadata = { title: "Legends history" };

function dayWindow(): { after: string } {
  const after = new Date(Date.now() - 31 * 86_400_000);
  return { after: after.toISOString() };
}

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

  const bounds = await getSeasonBounds().catch(() => null);
  const after = bounds?.season_start ?? dayWindow().after;

  const [series, history, battles] = await Promise.allSettled([
    getLegendSeries(tag, after),
    getLegendHistory(tag),
    getBattlelogHistory(tag, after),
  ]);

  const days = series.status === "fulfilled" ? [...series.value.items].sort((a, b) => a.day.localeCompare(b.day)) : [];
  const seasons =
    history.status === "fulfilled"
      ? [...history.value.items].sort((a, b) => b.season.localeCompare(a.season))
      : [];
  const battleItems = battles.status === "fulfilled" ? battles.value.items : [];

  const attacksByDay = groupLegendAttacks(battleItems);
  const summary = summarizeAttacks(battleItems);
  const selectedDay = day && days.some((d) => d.day === day) ? day : days[days.length - 1]?.day;
  const dayLog = selectedDay
    ? await getLegendDayBattlelog(tag, selectedDay).catch(() => null)
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

  const tide = days.map((d) => ({ day: d.day, trophies: d.trophies }));
  const net = days.map((d) => ({
    day: d.day,
    attack: Math.abs(d.attackTrophies),
    defense: -Math.abs(d.defenseTrophies),
  }));
  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  const seasonNet = firstDay && lastDay ? lastDay.trophies - firstDay.trophies : null;

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <Panel
        title="This season's tide"
        description="Trophies at the end of each Legend day."
        className="rounded-panel p-6 sm:p-8 lg:col-span-8"
      >
        {tide.length > 1 ? (
          <TrophyTideChart data={tide} />
        ) : (
          <p className="text-sm text-ink-300">Two Legend days are needed to draw the tide.</p>
        )}
      </Panel>

      <Panel title="Season form" className="rounded-tile p-6 lg:col-span-4 lg:self-start">
        <dl className="divide-y divide-ink-800">
          {[
            ["Net trophies", seasonNet === null ? "n/a" : seasonNet > 0 ? `+${seasonNet}` : String(seasonNet)],
            ["Attacks tracked", String(summary.attacks)],
            ["Triple rate", formatPercent(summary.tripleRate)],
            ["No star rate", formatPercent(summary.zeroRate)],
            ["Average destruction", formatPercent(summary.averageDestruction)],
            ["Average attack time", formatDuration(summary.averageDuration)],
          ].map(([label, value], i) => (
            <div key={label} className="flex items-baseline justify-between py-2.5">
              <dt className="text-sm text-ink-300">{label}</dt>
              <dd className={`font-mono tabular-nums ${i === 0 ? "text-xl font-semibold text-gold-300" : "text-base"}`}>
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
          days={days.map((d) => d.day)}
          attacksByDay={attacksByDay}
          selectedDay={selectedDay}
          basePath={basePath}
        />
      </Panel>

      <Panel
        title="Gains against losses"
        description="Trophies won attacking, trophies lost defending."
        className="rounded-2xl p-6 lg:col-span-5"
      >
        {net.length > 0 && <AttackDefenseChart data={net} />}
      </Panel>

      {selectedDay && (
        <Panel
          title={`Day ${selectedDay}`}
          className="rounded-3xl p-6 sm:p-8 lg:col-span-12"
        >
          {dayLog ? (
            <DayInspector log={dayLog} />
          ) : (
            <p className="text-sm text-ink-300">Battle details for this day could not be loaded.</p>
          )}
        </Panel>
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
                season: s.season,
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
