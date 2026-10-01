import { apiGet } from "./client";
import type {
  ClanSearchHit,
  CurrentDates,
  GlobalCounts,
  LegendTrophyBucket,
  Paginated,
  PlayerSearchHit,
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
import { tagToApi } from "./tags";
import type {
  BattleHistoryItem,
  LegendDayBattlelog,
  LegendSeasonRecord,
  LegendSeriesDay,
  PlayerRankings,
  SeasonBounds,
} from "./types";

export const getSeasonBounds = () =>
  apiGet<SeasonBounds>("/v2/dates/season-start-end", { revalidate: 3600 });

export const getLegendSeries = (tag: string, after?: string, before?: string) =>
  apiGet<{ tag: string; items: LegendSeriesDay[] }>(`/v2/player/${tagToApi(tag)}/legend/series`, {
    query: { "time[after]": after, "time[before]": before },
    revalidate: 120,
  });

export const getLegendHistory = (tag: string) =>
  apiGet<{ items: LegendSeasonRecord[] }>(`/v2/player/${tagToApi(tag)}/legend-history`, {
    revalidate: 600,
  });

export const getLegendDayBattlelog = (tag: string, day: string) =>
  apiGet<LegendDayBattlelog>(
    `/v2/player/${tagToApi(tag)}/legend/${encodeURIComponent(day)}/battlelog`,
    { revalidate: 120 },
  );

export const getBattlelogHistory = (tag: string, after?: string, before?: string) =>
  apiGet<{ items: BattleHistoryItem[] }>(`/v2/player/${tagToApi(tag)}/battlelog/history`, {
    query: { "time[after]": after, "time[before]": before },
    revalidate: 120,
  });

export const getPlayerRankings = (tag: string) =>
  apiGet<PlayerRankings>(`/v2/player/${tagToApi(tag)}/rankings`, { revalidate: 300 });
