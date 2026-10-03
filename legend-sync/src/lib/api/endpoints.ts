import { dayCandidates, stripVersionPrefix } from "../legend";
import { ApiError, apiGet } from "./client";
import { tagToApi } from "./tags";
import type {
  BattleHistoryItem,
  ClanSearchHit,
  CurrentDates,
  GlobalCounts,
  LegendDayBattlelog,
  LegendSeasonRecord,
  LeagueHistoryItem,
  LeagueTierStatistics,
  LegendSeriesDay,
  LegendTrophyBucket,
  Paginated,
  PlayerRankings,
  PlayerSearchHit,
  RankedBattlelog,
  RankedLeagueGroup,
  SeasonBounds,
} from "./types";

export const getGlobalCounts = () => apiGet<GlobalCounts>("/v2/counts", { revalidate: 120 });

export const getCurrentDates = () => apiGet<CurrentDates>("/v2/dates/current", { revalidate: 300 });

export const getLegendTrophyBuckets = () =>
  apiGet<{ items: LegendTrophyBucket[] }>("/v2/legends/trophy-buckets", { revalidate: 300 });

export const searchPlayers = (query: string, limit = 8, signal?: AbortSignal) =>
  apiGet<Paginated<PlayerSearchHit>>("/v2/player/search", {
    query: { query, limit },
    revalidate: 0,
    signal,
  });

export const searchClans = (query: string, limit = 8, signal?: AbortSignal) =>
  apiGet<Paginated<ClanSearchHit>>("/v2/clan/search", {
    query: { query, limit },
    revalidate: 0,
    signal,
  });

/* ---------- Player and Legend League ---------- */

export async function getSeasonBounds(): Promise<SeasonBounds> {
  const bounds = await apiGet<SeasonBounds>("/v2/dates/season-start-end", { revalidate: 3600 });
  return {
    season_start: stripVersionPrefix(bounds.season_start),
    season_end: stripVersionPrefix(bounds.season_end),
  };
}

export const getLegendSeries = (tag: string, after?: string, before?: string) =>
  apiGet<{ tag: string; items: LegendSeriesDay[] }>(`/v2/player/${tagToApi(tag)}/legend/series`, {
    query: { "time[after]": after, "time[before]": before },
    revalidate: 120,
  });

export const getLegendHistory = (tag: string) =>
  apiGet<{ items: LegendSeasonRecord[] }>(`/v2/player/${tagToApi(tag)}/legend-history`, {
    revalidate: 600,
  });

/** Tries the day in each known format, since the API's day identifier format has changed once already. */
export async function getLegendDayBattlelog(tag: string, rawDay: string): Promise<LegendDayBattlelog> {
  let lastError: unknown = new Error("No day identifier to try");
  for (const candidate of dayCandidates(rawDay)) {
    try {
      return await apiGet<LegendDayBattlelog>(
        `/v2/player/${tagToApi(tag)}/legend/${encodeURIComponent(candidate)}/battlelog`,
        { revalidate: 120 },
      );
    } catch (error) {
      lastError = error;
      const retryable = error instanceof ApiError && [400, 404, 422].includes(error.status);
      if (!retryable) throw error;
    }
  }
  throw lastError;
}

export const getBattlelogHistory = (tag: string, after?: string, before?: string) =>
  apiGet<{ items: BattleHistoryItem[] }>(`/v2/player/${tagToApi(tag)}/battlelog/history`, {
    query: { "time[after]": after, "time[before]": before },
    revalidate: 120,
  });

export const getPlayerRankings = (tag: string) =>
  apiGet<PlayerRankings>(`/v2/player/${tagToApi(tag)}/rankings`, { revalidate: 300 });

/* ---------- Ranked seasons ---------- */

export const getLeagueHistory = (tag: string) =>
  apiGet<{ items: LeagueHistoryItem[] }>(`/v2/player/${tagToApi(tag)}/league/history`, {
    revalidate: 300,
  });

export const getRankedBattlelog = (tag: string, seasonId: string) =>
  apiGet<RankedBattlelog>(
    `/v2/player/${tagToApi(tag)}/ranked/${encodeURIComponent(seasonId)}/battlelog`,
    { revalidate: 300 },
  );

export const getRankedGroup = (seasonId: string, leagueGroupId: string) =>
  apiGet<RankedLeagueGroup>(
    `/v2/ranked/${encodeURIComponent(seasonId)}/groups/${encodeURIComponent(leagueGroupId)}`,
    { revalidate: 600 },
  );

export const getLeagueTierStatistics = (seasonId: string, leagueTierId: number) =>
  apiGet<LeagueTierStatistics>(
    `/v2/stats/league/tournaments/${encodeURIComponent(seasonId)}/tiers/${leagueTierId}`,
    { revalidate: 900 },
  );
