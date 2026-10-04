import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ClanHeader } from "@/components/clan/clan-header";
import { SeasonBars } from "@/components/clan/season-bars";
import { SeasonRoster } from "@/components/clan/season-roster";
import { Panel } from "@/components/ui/panel";
import {
  getClanLegendHistory,
  getClanLegendSummary,
  getClanProfile,
  getClanRankings,
  getClanRecords,
} from "@/lib/api/endpoints";
import { isValidTag, normalizeTag, tagToSlug } from "@/lib/api/tags";
import { toNum } from "@/lib/api/types";
import { bestPlacement, bySeasonDesc, summarizeSeason, townHallSpread } from "@/lib/clan";
import { formatInt, formatPercent } from "@/lib/format";

export const metadata: Metadata = { title: "Clan" };

export default async function ClanPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ season?: string }>;
}) {
  const { tag: slug } = await params;
  const { season } = await searchParams;
  if (!isValidTag(slug)) notFound();
  const tag = normalizeTag(slug);
  const path = `/clans/${tagToSlug(tag)}`;

  const [profileR, historyR, summaryR, recordsR, rankingsR] = await Promise.allSettled([
    getClanProfile(tag),
    getClanLegendHistory(tag),
    getClanLegendSummary(tag, 5),
    getClanRecords(tag),
    getClanRankings(tag),
  ]);

  const profile = profileR.status === "fulfilled" ? profileR.value : null;
  const rows = historyR.status === "fulfilled" ? historyR.value.items : [];
  const topFinishes = summaryR.status === "fulfilled" ? summaryR.value.topFinishes : [];
  const records = recordsR.status === "fulfilled" ? recordsR.value : null;
  const rankings = rankingsR.status === "fulfilled" ? rankingsR.value : null;

  const seasons = bySeasonDesc(rows);
  const seasonKeys = [...seasons.keys()];
  const currentKey = season && seasons.has(season) ? season : seasonKeys[0];
  const currentRows = currentKey ? (seasons.get(currentKey) ?? []) : [];
  const summary = currentKey ? summarizeSeason(currentKey, currentRows) : null;

  const chartData = [...seasons]
    .reverse()
    .slice(-18)
    .map(([s, r]) => ({ season: s, players: r.length, top: Math.max(...r.map((x) => toNum(x.trophies) ?? 0)) }));

  const spread = profile ? townHallSpread(profile) : [];
  const maxSpread = Math.max(...spread.map((s) => s.count), 1);
  const homeBest = rankings ? bestPlacement(rankings.homeVillage.placements) : null;
  const capitalBest = rankings ? bestPlacement(rankings.clanCapital.placements) : null;

  return (
    <div className="space-y-8">
      <ClanHeader profile={profile} tag={tag} />

      {rows.length === 0 ? (
        <Panel className="rounded-2xl p-8">
          <h2 className="text-xl font-semibold tracking-tight">No Legend seasons tracked for this clan</h2>
          <p className="mt-2 max-w-prose text-ink-300">
            Seasons appear once the tracker has recorded Legend finishes for players while they were in this clan.
          </p>
        </Panel>
      ) : (
        <div className="grid gap-5 lg:grid-cols-12">
          {summary && (
            <section className="rounded-panel bg-ink-800 p-6 sm:p-8 lg:col-span-8">
              <p className="text-sm text-ink-300">{summary.season}</p>
              <p className="mt-1 font-mono text-5xl font-semibold tabular-nums text-gold-300">{summary.players}</p>
              <p className="text-sm text-ink-300">Legend players from this clan</p>
              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
                {[
                  ["Top trophies", formatInt(summary.topTrophies)],
                  ["Average trophies", formatInt(Math.round(summary.averageTrophies))],
                  ["Best global rank", summary.bestRank ? `#${formatInt(summary.bestRank)}` : "unranked"],
                  ["Ranked players", `${summary.rankedPlayers}/${summary.players}`],
                  ["Attacks won", formatInt(summary.attackWins)],
                  ["Defenses held", formatInt(summary.defenseWins)],
                  [
                    "Win share",
                    formatPercent(
                      summary.attackWins + summary.defenseWins > 0
                        ? (summary.attackWins / (summary.attackWins + summary.defenseWins)) * 100
                        : null,
                      0,
                    ),
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-ink-500">{label}</dt>
                    <dd className="font-mono text-lg tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <Panel title="Seasons" className="rounded-2xl p-5 lg:col-span-4 lg:row-span-2">
            <nav aria-label="Legend seasons">
              <ol className="max-h-[26rem] space-y-1 overflow-y-auto pr-1">
                {seasonKeys.map((key) => {
                  const active = key === currentKey;
                  const list = seasons.get(key) ?? [];
                  return (
                    <li key={key}>
                      <Link
                        href={`${path}?season=${encodeURIComponent(key)}`}
                        scroll={false}
                        aria-current={active ? "true" : undefined}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                          active ? "bg-ink-800 ring-1 ring-gold-600" : "hover:bg-ink-800/70"
                        }`}
                      >
                        <span className="font-medium">{key}</span>
                        <span className="font-mono text-xs tabular-nums text-ink-300">
                          {list.length} players, top {formatInt(toNum(list[0]?.trophies))}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </Panel>

          <Panel title="Legend players per season" className="rounded-tile p-6 lg:col-span-8">
            <SeasonBars data={chartData} />
          </Panel>

          <Panel
            title={`Roster in ${currentKey}`}
            description="Players ordered by final Legend trophies."
            className="rounded-3xl p-6 sm:p-8 lg:col-span-12"
          >
            <SeasonRoster rows={currentRows} />
          </Panel>

          {topFinishes.length > 0 && (
            <Panel title="Best finishes ever" description="Highest global ranks by players while in this clan." className="rounded-2xl p-6 lg:col-span-6">
              <ol className="divide-y divide-ink-800">
                {topFinishes.map((f) => (
                  <li key={`${f.season}-${f.tag}`} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="min-w-0">
                      <Link href={`/player/${tagToSlug(f.tag)}/legends`} className="block truncate font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-gold-400">
                        {f.name}
                      </Link>
                      <span className="text-xs text-ink-500">{f.season}</span>
                    </span>
                    <span className="text-right font-mono tabular-nums">
                      <span className="block text-gold-300">#{formatInt(f.rank)}</span>
                      <span className="block text-xs text-ink-500">{formatInt(f.trophies)} trophies</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Panel>
          )}

          <Panel title="Standing and records" className="rounded-2xl p-6 lg:col-span-6">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                ["Clan points", profile ? formatInt(profile.clanPoints) : "n/a"],
                ["Best local rank", homeBest ? `#${formatInt(homeBest)}` : "unranked"],
                ["Capital best rank", capitalBest ? `#${formatInt(capitalBest)}` : "unranked"],
                ["War wins", profile ? formatInt(profile.warWins) : "n/a"],
                ["War win streak", profile ? formatInt(profile.warWinStreak) : "n/a"],
                ["Best streak ever", records?.warWinStreak ? formatInt(records.warWinStreak.value) : "n/a"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-ink-500">{label}</dt>
                  <dd className="font-mono text-lg tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            {spread.length > 0 && (
              <div className="mt-6 border-t border-ink-800 pt-4">
                <h3 className="text-sm font-semibold">Town Hall spread</h3>
                <ul className="mt-2 space-y-1.5">
                  {spread.map((s) => (
                    <li key={s.level} className="grid grid-cols-[3rem_1fr_2rem] items-center gap-3 text-xs">
                      <span className="text-ink-300">TH{s.level}</span>
                      <span className="h-2 rounded-full bg-ink-800">
                        <span className="block h-full rounded-full bg-tide-400" style={{ width: `${(s.count / maxSpread) * 100}%` }} />
                      </span>
                      <span className="text-right font-mono tabular-nums text-ink-300">{s.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}
