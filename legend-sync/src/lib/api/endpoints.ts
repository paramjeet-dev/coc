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
