import type { Metadata } from "next";
import { AttackDefenseChart } from "@/components/legend/attack-defense-chart";
import { AttackStrip } from "@/components/legend/attack-strip";
import { DayInspector } from "@/components/legend/day-inspector";
import { SeasonHistoryChart } from "@/components/legend/season-history-chart";
import { SeasonTable } from "@/components/legend/season-table";
import { PerformanceHeatmap } from "@/components/legend/performance-heatmap";
import { LegendPerformanceChart } from "@/components/legend/performance-chart";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { StatGrid } from "@/components/ui/stat";
import {
  getBattlelogHistory,
  getLegendDayBattlelog,
  getLegendDayCounts,
  getLegendHistory,
  getLegendSeries,
  getPlayerRankings,
} from "@/lib/api/endpoints";
import { toNum } from "@/lib/api/types";
import { normalizeTag } from "@/lib/api/tags";
import { formatPercent } from "@/lib/format";
import {
  compareSeasons,
  dayKey,
  formatDuration,
  buildPerformance,
  groupLegendAttacks,
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

  const [series, history, battles, rankings] = await Promise.allSettled([
    getLegendSeries(tag),
    getLegendHistory(tag),
    getBattlelogHistory(tag, after),
    getPlayerRankings(tag),
  ]);
  const liveTrophies =
    rankings.status === "fulfilled" ? toNum(rankings.value.homeVillage?.trophies) : null;

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
      <EmptyState title="No Legend data for this player yet">
        Legend history appears once the tracker has seen this player in Legend League. Check the
        tag, or come back after their next Legend day.
      </EmptyState>
    );
  }

  const counts = await Promise.allSettled(keys.map((k) => getLegendDayCounts(tag, k)));
  const attackCounts = new Map<string, number>();
  const defenseCounts = new Map<string, number>();
  keys.forEach((k, i) => {
    const r = counts[i];
    const fromSummary = r?.status === "fulfilled" ? r.value : null;
    const attacks = fromSummary?.attacks ?? attacksByDay.get(k)?.length;
    if (attacks) attackCounts.set(k, attacks);
    if (fromSummary?.defenses) defenseCounts.set(k, fromSummary.defenses);
  });
  const performance = buildPerformance(days, attackCounts, defenseCounts, liveTrophies ?? null);
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
            title="Legend performance"
            eyebrow="Trajectory"
            className="lg:col-span-8"
          >
            {performance.length > 1 ? (
              <LegendPerformanceChart data={performance} />
            ) : (
              <p className="text-sm text-ink-300">Two Legend days are needed to draw the chart.</p>
            )}
          </Panel>

          <Panel title="Recent form" eyebrow="Form" className="lg:col-span-4 lg:self-start">
            <StatGrid
              size="lg"
              className="grid-cols-2 sm:grid-cols-2"
              items={[
                { label: "Net trophies", value: signed(netTotal), tone: netTotal >= 0 ? "gold" : "ember" },
                { label: "Legend days", value: String(days.length) },
                { label: "Attacks tracked", value: String(summary.attacks) },
                { label: "Triple rate", value: formatPercent(summary.tripleRate), tone: "tide" },
                { label: "No star rate", value: formatPercent(summary.zeroRate) },
                { label: "Avg destruction", value: formatPercent(summary.averageDestruction) },
                { label: "Avg attack time", value: formatDuration(summary.averageDuration) },
              ]}
            />
          </Panel>

          <Panel
            title="Attack strip"
            description="One column per day, one dot per attack. Pick a day to inspect it."
            className="lg:col-span-7"
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
            className="lg:col-span-5"
          >
            <AttackDefenseChart data={net} />
          </Panel>

          <Panel
            title="Performance heatmap"
            eyebrow="Daily net"
            description="One cell per Legend day, coloured by net trophies. Pick a day to inspect it."
            className="lg:col-span-12"
          >
            <PerformanceHeatmap days={performance} selectedDay={selectedKey} basePath={basePath} />
          </Panel>

          {selectedKey && (
            <Panel title={`Day ${selectedKey}`} className="lg:col-span-12">
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
            className="lg:col-span-5"
          >
            <SeasonHistoryChart
              data={[...seasons].reverse().map((s) => ({
                season: seasonLabel(s.season),
                trophies: typeof s.trophies === "number" ? s.trophies : 0,
              }))}
            />
          </Panel>
          <Panel title="Season ledger" className="lg:col-span-7">
            <SeasonTable seasons={seasons.slice(0, 12)} />
          </Panel>
        </>
      )}
    </div>
  );
}
