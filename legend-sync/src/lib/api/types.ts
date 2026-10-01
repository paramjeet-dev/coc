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

/* ---------- Player and Legend League ---------- */

export type LegendSeriesDay = {
  day: string;
  attackTrophies: number;
  defenseTrophies: number;
  trophies: number;
};

export type LegendSeasonRecord = {
  season: string;
  tag: string;
  name: string;
  expLevel: Num;
  trophies: Num;
  attackWins: Num;
  defenseWins: Num;
  rank: Num;
  clan?: {
    tag?: string;
    name?: string;
    badgeUrls?: { small?: string; medium?: string; large?: string };
  };
  leagueTier?: { id: Num; name?: string };
};

export type PlayerRankings = {
  tag: string;
  homeVillage?: { trophies?: Num | null; globalRank?: Num | null; localRank?: Num | null };
  builderBase?: { trophies?: Num | null; globalRank?: Num | null; localRank?: Num | null };
  location?: { id: Num; name?: string; isCountry: boolean; countryCode?: string };
};

export type SeasonBounds = { season_start: string; season_end: string };

export type BattleHistoryItem = {
  battleMode: "farming" | "ranked" | "legend";
  battleTime: string;
  stars: number;
  destructionPercentage: Num;
  duration: number;
  lootedResources: { gold: number; elixir: number; darkElixir: number };
  shareCode: string | null;
  familyId: DecimalId | null;
};

export type LegendBattle = {
  time: string;
  townHallLevel: number;
  opponent: { tag: string; name: string; townHallLevel: number };
  stars: number;
  destructionPercentage: Num;
  duration: number;
  shareCode: string | null;
  familyId: DecimalId | null;
  trophies: number;
};

export type LegendDefenseEntry = LegendBattle | { trophies: number; automatic: true };

export type LegendDayBattlelog = {
  tag: string;
  day: string;
  attackTrophies: number;
  defenseTrophies: number;
  trophies: number;
  attacks: LegendBattle[];
  defenses: LegendDefenseEntry[];
};
