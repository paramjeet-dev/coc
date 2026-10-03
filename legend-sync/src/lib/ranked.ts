import type {
  LeagueHistoryItem,
  LeagueTierStatistics,
  RankedGroupMember,
  RankedSeasonRecord,
} from "./api/types";

export function rankedSeasons(items: LeagueHistoryItem[]): RankedSeasonRecord[] {
  return items
    .filter((i): i is RankedSeasonRecord => i.mode === "ranked")
    .sort((a, b) => b.seasonId.localeCompare(a.seasonId));
}

export function winRate(wins: number, losses: number): number | null {
  const total = wins + losses;
  return total > 0 ? (wins / total) * 100 : null;
}

export function starsPerBattle(stars: number, wins: number, losses: number): number | null {
  const total = wins + losses;
  return total > 0 ? stars / total : null;
}

/** Where trophies fall among the tier percentiles: "Top 10%", "Top half" and so on. */
export function tierStanding(
  trophies: number,
  p: LeagueTierStatistics["trophyPercentiles"],
): string | null {
  if (p.p50 === null) return null;
  if (p.p90 !== null && trophies >= p.p90) return "Top 10% of the tier";
  if (p.p75 !== null && trophies >= p.p75) return "Top 25% of the tier";
  if (trophies >= p.p50) return "Top half of the tier";
  if (p.p25 !== null && trophies >= p.p25) return "Lower half, above the bottom quarter";
  return "Bottom quarter of the tier";
}

export function groupLeaders(members: RankedGroupMember[]): RankedGroupMember[] {
  return [...members].sort((a, b) => a.placement - b.placement);
}
