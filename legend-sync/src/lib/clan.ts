import { toNum, type ClanLegendRow, type ClanProfile } from "./api/types";

export function bySeasonDesc(rows: ClanLegendRow[]): Map<string, ClanLegendRow[]> {
  const map = new Map<string, ClanLegendRow[]>();
  for (const row of rows) {
    const list = map.get(row.season);
    if (list) list.push(row);
    else map.set(row.season, [row]);
  }
  for (const list of map.values()) list.sort((a, b) => (toNum(b.trophies) ?? 0) - (toNum(a.trophies) ?? 0));
  return new Map([...map].sort((a, b) => b[0].localeCompare(a[0])));
}

export type SeasonSummary = {
  season: string;
  players: number;
  topTrophies: number;
  averageTrophies: number;
  bestRank: number | null;
  rankedPlayers: number;
  attackWins: number;
  defenseWins: number;
};

export function summarizeSeason(season: string, rows: ClanLegendRow[]): SeasonSummary {
  const trophies = rows.map((r) => toNum(r.trophies) ?? 0);
  const ranks = rows.map((r) => toNum(r.rank)).filter((r): r is number => r !== null && r > 0);
  return {
    season,
    players: rows.length,
    topTrophies: trophies.length ? Math.max(...trophies) : 0,
    averageTrophies: trophies.length ? trophies.reduce((a, b) => a + b, 0) / trophies.length : 0,
    bestRank: ranks.length ? Math.min(...ranks) : null,
    rankedPlayers: ranks.length,
    attackWins: rows.reduce((s, r) => s + (toNum(r.attackWins) ?? 0), 0),
    defenseWins: rows.reduce((s, r) => s + (toNum(r.defenseWins) ?? 0), 0),
  };
}

export function townHallSpread(profile: ClanProfile): Array<{ level: number; count: number }> {
  const counts = new Map<number, number>();
  for (const m of profile.members) {
    const lvl = toNum(m.townHallLevel);
    if (lvl) counts.set(lvl, (counts.get(lvl) ?? 0) + 1);
  }
  return [...counts].map(([level, count]) => ({ level, count })).sort((a, b) => b.level - a.level);
}

export function bestPlacement(
  placements: Array<{ locationId: string; rank: number | string | null }>,
): number | null {
  const ranks = placements.map((p) => toNum(p.rank as never)).filter((r): r is number => r !== null && r > 0);
  return ranks.length ? Math.min(...ranks) : null;
}
