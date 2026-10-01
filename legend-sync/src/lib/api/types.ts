/**
 * The API serializes non-finite numbers as the strings "NaN", "Infinity" and "-Infinity".
 * Run every numeric field through toNum() before doing math or formatting.
 */
export type Num = number | "NaN" | "Infinity" | "-Infinity";

export function toNum(value: Num | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  return null;
}

/** Family IDs and base IDs are decimal strings. Never convert them to a JavaScript number. */
export type DecimalId = string;

export type GlobalCounts = {
  players_in_war: Num;
  clans_in_war: Num;
  total_join_leaves: Num;
  players_in_legends: Num;
  player_count: Num;
  clan_count: Num;
  wars_stored: Num;
};

export type CurrentDates = {
  season: string;
  raid: string;
  legend: string;
  "clan-games": string;
};

export type LegendTrophyBucket = {
  minimumTrophies: number;
  maximumTrophies: number;
  playerCount: number;
};

export type PlayerSearchHit = {
  name: string;
  tag: string;
  townHallLevel: Num;
  leagueTier?: { id: Num; name: string };
  clan?: { name?: string; tag: string; badge?: string; clanLevel?: Num };
};

export type ClanSearchHit = {
  name: string;
  tag: string;
  badge?: string;
  clanLevel: Num;
  members: Num;
  warLeague?: { id: Num; name: string };
};

export type Paginated<T> = {
  items: T[];
  pagination: { limit: Num; hasMore: boolean; nextCursor: string | null };
};

export type ApiErrorBody = {
  code: string;
  message: string;
  request_id?: string;
  details?: Array<{ field: string; message: string }>;
};
