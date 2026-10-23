import { EmptyState } from "@/components/ui/empty-state";
import { HeroPanel } from "@/components/ui/hero-panel";
import type { Metadata } from "next";
import { DayInspector } from "@/components/legend/day-inspector";
import { RankedTrophyChart } from "@/components/ranked/ranked-trophy-chart";
import { SeasonTrail } from "@/components/ranked/season-trail";
import { Standings } from "@/components/ranked/standings";
import { Panel } from "@/components/ui/panel";
import { isOfficialConfigured } from "@/lib/coc/client";
import { battlelogFromGroup, getOfficialRankedGroup, getOfficialRankedSeasons } from "@/lib/coc/ranked";
import { normalizeTag } from "@/lib/api/tags";
import { LeagueBadge } from "@/components/ui/league-badge";
import { AssetIcon } from "@/components/ui/asset-icon";
import { formatInt, formatPercent } from "@/lib/format";
import { rankedSeasons, seasonLabel, starsPerBattle, winRate } from "@/lib/ranked";

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

  if (!isOfficialConfigured()) {
    return (
      <EmptyState tone="error" title="Official API is not configured">
Set COC_EMAIL and COC_PASSWORD so ranked data can be loaded from the Clash of Clans API.
</EmptyState>
    );
  }

  const seasons = await getOfficialRankedSeasons(tag).then(
    (list) => rankedSeasons(list),
    () => null,
  );

  if (!seasons) {
    return (
      <EmptyState tone="error" title="Ranked history could not be loaded">
The Clash of Clans API did not answer. Try again in a moment.
</EmptyState>
    );
  }

  const current = seasons.find((s) => s.seasonId === season) ?? seasons[0];
  if (!current) {
    return (
      <EmptyState title="No ranked seasons found for this player">
Ranked seasons appear once this player has finished a tournament group.
</EmptyState>
    );
  }

  const groupValue = await getOfficialRankedGroup(current).catch((error: unknown) => {
    console.error("[ranked] league group failed", current.leagueGroupId, current.seasonId, error);
    return null;
  });
  const battlelog = groupValue ? battlelogFromGroup(groupValue, current) : null;
  const members = groupValue ? groupValue.members : [];

  const attackRate = winRate(current.attackWins, current.attackLosses);
  const defenseRate = winRate(current.defenseWins, current.defenseLosses);
  const chartData = [...seasons].reverse().map((s) => ({ season: seasonLabel(s.seasonId), trophies: s.leagueTrophies }));

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <HeroPanel className="lg:col-span-8">
        <div className="flex items-center gap-4">
          <LeagueBadge name={current.league.name} size={72} />
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-gold-400">Ranked season</p>
            <h2 className="font-mono text-2xl font-semibold tracking-tight">{seasonLabel(current.seasonId)}</h2>
          </div>
          <div className="ml-auto text-right">
            <p className="flex items-center justify-end gap-2 font-mono text-4xl font-semibold tabular-nums text-gold-300">
              <AssetIcon name="trophy" size={32} label="Trophies" />
              {formatInt(current.leagueTrophies)}
            </p>
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
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-500">{label}</dt>
              <dd className="font-mono text-lg tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </HeroPanel>

      <Panel title="Seasons" className="lg:col-span-4">
        <SeasonTrail seasons={seasons} selected={current.seasonId} basePath={basePath} />
      </Panel>

      <Panel title="Season finishes" description="League trophies at the end of each ranked season." className="lg:col-span-5">
        <RankedTrophyChart data={chartData} />
      </Panel>

      <Panel
        title="Group standings"
        description={members.length ? `${members.length} players in this tournament group.` : undefined}
        className="lg:col-span-7"
      >
        {members.length > 0 ? (
          <Standings members={members} playerTag={tag} />
        ) : (
          <p className="text-sm text-ink-300">The group for this season is not available.</p>
        )}
      </Panel>

      <Panel
        title={`Battles in ${seasonLabel(current.seasonId)}`}
        description={
          battlelog
            ? `${battlelog.registeredAttacks} attacks and ${battlelog.registeredDefenses} defenses registered out of ${battlelog.maxBattles}.`
            : undefined
        }
        className="lg:col-span-12"
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
          <p className="text-sm text-ink-300">Battle details are not available for this season.</p>
        )}
      </Panel>
    </div>
  );
}
