import type { Metadata } from "next";
import Image from "next/image";
import { DayInspector } from "@/components/legend/day-inspector";
import { PercentileLadder } from "@/components/ranked/percentile-ladder";
import { RankedTrophyChart } from "@/components/ranked/ranked-trophy-chart";
import { SeasonTrail } from "@/components/ranked/season-trail";
import { Standings } from "@/components/ranked/standings";
import { Panel } from "@/components/ui/panel";
import {
  getLeagueHistory,
  getLeagueTierStatistics,
  getRankedBattlelog,
  getRankedGroup,
} from "@/lib/api/endpoints";
import { normalizeTag } from "@/lib/api/tags";
import { toNum } from "@/lib/api/types";
import { leagueTierIcon } from "@/lib/assets";
import { formatInt, formatPercent } from "@/lib/format";
import { rankedSeasons, starsPerBattle, tierStanding, winRate } from "@/lib/ranked";

export const metadata: Metadata = { title: "Ranked seasons" };

export const dynamic = "force-dynamic";

export default async function PlayerRankedPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ season?: string }>;
}) {
  const { tag: slug } = await params;
  const { season } = await searchParams;
  const tag = normalizeTag(slug);
  const basePath = `/player/${slug.toUpperCase().replace(/^#/, "")}/ranked`;

  const history = await getLeagueHistory(tag).then(
    (r) => ({ ok: true as const, seasons: rankedSeasons(r.items) }),
    () => ({ ok: false as const, seasons: [] }),
  );

  if (!history.ok) {
    return (
      <Panel className="rounded-2xl p-8">
        <h2 className="text-xl font-semibold tracking-tight">Ranked history could not be loaded</h2>
        <p className="mt-2 max-w-prose text-ink-300">The stats service did not answer. Try again in a moment.</p>
      </Panel>
    );
  }

  const seasons = history.seasons;
  if (seasons.length === 0) {
    return (
      <Panel className="rounded-2xl p-8">
        <h2 className="text-xl font-semibold tracking-tight">No ranked seasons stored for this player</h2>
        <p className="mt-2 max-w-prose text-ink-300">
          Ranked seasons appear once the tracker has seen this player finish a tournament group.
        </p>
      </Panel>
    );
  }

  const current = seasons.find((s) => s.seasonId === season) ?? seasons[0];

  const [log, group, tier] = await Promise.allSettled([
    getRankedBattlelog(tag, current.seasonId),
    getRankedGroup(current.seasonId, current.leagueGroupId),
    getLeagueTierStatistics(current.seasonId, current.league.id),
  ]);
  const battlelog = log.status === "fulfilled" ? log.value : null;
  const members = group.status === "fulfilled" ? group.value.members : [];
  const tierStats = tier.status === "fulfilled" ? tier.value : null;

  const attackRate = winRate(current.attackWins, current.attackLosses);
  const defenseRate = winRate(current.defenseWins, current.defenseLosses);
  const standing = tierStats ? tierStanding(current.leagueTrophies, tierStats.trophyPercentiles) : null;
  const chartData = [...seasons].reverse().map((s) => ({ season: s.seasonId, trophies: s.leagueTrophies }));

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <section className="rounded-panel bg-ink-800 p-6 sm:p-8 lg:col-span-8">
        <div className="flex items-center gap-4">
          <Image src={leagueTierIcon(current.league.name)} alt="" width={64} height={64} className="size-16" unoptimized />
          <div>
            <p className="text-sm text-ink-300">{current.seasonId}</p>
            <h2 className="text-2xl font-semibold tracking-tight">{current.league.name}</h2>
          </div>
          <div className="ml-auto text-right">
            <p className="font-mono text-4xl font-semibold tabular-nums text-gold-300">{formatInt(current.leagueTrophies)}</p>
            <p className="text-sm text-ink-300">
              placed <span className="font-mono tabular-nums text-ink-100">#{current.placement}</span> in group
            </p>
          </div>
        </div>
        <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
          {[
            ["Attack record", `${current.attackWins}W ${current.attackLosses}L`],
            ["Attack win rate", formatPercent(attackRate, 0)],
            ["Stars per attack", (starsPerBattle(current.attackStars, current.attackWins, current.attackLosses) ?? NaN).toFixed(2).replace("NaN", "n/a")],
            ["Defense record", `${current.defenseWins}W ${current.defenseLosses}L`],
            ["Defense hold rate", formatPercent(defenseRate, 0)],
            ["Stars conceded", String(current.defenseStars)],
            ["Battle cap", String(current.maxBattles)],
            ["Town Hall", current.townHallLevel ? String(current.townHallLevel) : "n/a"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-ink-500">{label}</dt>
              <dd className="font-mono text-lg tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Panel title="Seasons" className="rounded-2xl p-5 lg:col-span-4 lg:row-span-2">
        <SeasonTrail seasons={seasons} selected={current.seasonId} basePath={basePath} />
      </Panel>

      <Panel
        title="Against the tier"
        description={standing ?? "Tier percentiles are not available for this season."}
        className="rounded-3xl p-6 sm:p-8 lg:col-span-8"
      >
        {tierStats ? (
          <>
            <PercentileLadder trophies={current.leagueTrophies} percentiles={tierStats.trophyPercentiles} />
            <dl className="grid grid-cols-3 gap-4 border-t border-ink-800 pt-4 text-sm">
              {[
                ["Groups in tier", formatInt(tierStats.groupCount)],
                ["Players in tier", formatInt(tierStats.playerCount)],
                ["Avg gap to first", formatInt(toNum(tierStats.groupCompetitiveness.averageFirstPlaceGap))],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-ink-500">{label}</dt>
                  <dd className="font-mono text-base tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
      </Panel>

      <Panel title="Season finishes" description="League trophies at the end of each ranked season." className="rounded-tile p-6 lg:col-span-5">
        <RankedTrophyChart data={chartData} />
      </Panel>

      <Panel
        title="Group standings"
        description={members.length ? `${members.length} players in this tournament group.` : undefined}
        className="rounded-2xl p-6 lg:col-span-7"
      >
        {members.length > 0 ? (
          <Standings members={members} playerTag={tag} />
        ) : (
          <p className="text-sm text-ink-300">The group for this season could not be loaded.</p>
        )}
      </Panel>

      <Panel
        title={`Battles in ${current.seasonId}`}
        description={
          battlelog
            ? `${battlelog.registeredAttacks} attacks and ${battlelog.registeredDefenses} defenses registered out of ${battlelog.maxBattles}.`
            : undefined
        }
        className="rounded-3xl p-6 sm:p-8 lg:col-span-12"
      >
        {battlelog ? (
          <DayInspector
            log={{
              tag: battlelog.tag,
              day: battlelog.seasonId,
              attackTrophies: battlelog.attackTrophies,
              defenseTrophies: battlelog.defenseTrophies,
              trophies: battlelog.trophies,
              attacks: battlelog.attacks,
              defenses: battlelog.defenses,
            }}
          />
        ) : (
          <p className="text-sm text-ink-300">Battle details for this season could not be loaded.</p>
        )}
      </Panel>
    </div>
  );
}
