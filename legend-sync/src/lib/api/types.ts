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

/* ---------- Ranked seasons ---------- */

export type RankedSeasonRecord = {
  mode: "ranked";
  seasonId: string;
  leagueGroupId: string;
  league: { id: number; name: string };
  maxBattles: number;
  tag: string;
  name: string;
  townHallLevel: number | null;
  attackLosses: number;
  attackStars: number;
  attackWins: number;
  defenseLosses: number;
  defenseStars: number;
  defenseWins: number;
  leagueTrophies: number;
  placement: number;
};

export type LegendSeasonSummary = {
  mode: "legend";
  season: string;
  league: { id: number; name: string } | null;
  trophies: number;
  attackWins: number;
  defenseWins: number;
  rank: number;
};

export type LeagueHistoryItem = RankedSeasonRecord | LegendSeasonSummary;

export type RankedBattlelog = {
  tag: string;
  seasonId: string;
  leagueGroupId: string;
  league: { id: number; name: string };
  maxBattles: number;
  registeredAttacks: number;
  registeredDefenses: number;
  attackTrophies: number;
  defenseTrophies: number;
  trophies: number;
  attacks: LegendBattle[];
  defenses: LegendDefenseEntry[];
};

export type RankedGroupMember = {
  tag: string;
  name: string;
  townHallLevel: number | null;
  attackLosses: number;
  attackStars: number;
  attackWins: number;
  defenseLosses: number;
  defenseStars: number;
  defenseWins: number;
  leagueTrophies: number;
  placement: number;
};

export type RankedLeagueGroup = {
  leagueGroupId: string;
  seasonId: string;
  league: { id: number; name: string };
  maxBattles: number;
  members: RankedGroupMember[];
};

export type LeagueTierStatistics = {
  seasonId: string;
  league: { id: number; name: string };
  groupCount: number;
  playerCount: number;
  participatingPlayers: number;
  trophyPercentiles: {
    p10: number | null;
    p25: number | null;
    p50: number | null;
    p75: number | null;
    p90: number | null;
  };
  townHallDistribution: Array<{ level: number; count: number }>;
  groupCompetitiveness: {
    averageTrophyRange: Num | null;
    averageFirstPlaceGap: Num | null;
  };
};

/* ---------- Army meta ---------- */

export type Cohort = "legend_i" | "top_1000" | "top_200";

export type StarCounts = { zero: number; one: number; two: number; three: number };

export type ArmyFamily = {
  familyId: string;
  name: string | null;
  shareCode: string;
  attacks: number;
  players: number | null;
  starCounts: StarCounts;
  averageDuration: Num | null;
  averageDestruction: Num | null;
  totalLegendAttacks: number;
};

export type ArmySearchResult = { cohort: Cohort; items: ArmyFamily[] };

export type ArmyTimelineDay = {
  day: string;
  totalLegendAttacks: number;
  attacks: number;
  players: number;
  starCounts: StarCounts;
  averageDuration: Num | null;
  averageDestruction: Num | null;
};

export type ArmyTimeline = {
  cohort: Cohort;
  familyId: string;
  name: string | null;
  shareCode: string;
  items: ArmyTimelineDay[];
};

export type LegendDaysUsage = { id: number; uses: number; triples: number };

export type LegendDayStats = {
  day: string;
  attacks: number;
  players: number;
  starCounts: StarCounts;
  averageDuration: Num | null;
  averageDestruction: Num | null;
  heroes: LegendDaysUsage[];
  pets: LegendDaysUsage[];
  equipment: LegendDaysUsage[];
  petAssignments: Array<{ petId: number; heroId: number; uses: number; triples: number }>;
};

export type LegendDays = { cohort: Cohort; items: LegendDayStats[] };

/* ---------- Clans ---------- */

export type ClanProfile = {
  name: string;
  tag: string;
  badgeUrls: { small: string; medium: string; large: string };
  description: string;
  clanLevel: Num;
  clanPoints: Num;
  capitalGoldTotal?: Num;
  location?: { id: Num; name: string; isCountry: boolean; countryCode?: string };
  warLeague: { id: Num; name: string };
  publicWarLog: boolean;
  warWins: Num;
  warWinStreak: Num;
  memberCount: Num;
  troopsDonated?: Num;
  troopsReceived?: Num;
  members: Array<{ tag: string; name: string; townHallLevel: Num }>;
};

export type ClanLegendRow = {
  season: string;
  tag: string;
  name: string;
  trophies: Num;
  attackWins: Num;
  defenseWins: Num;
  rank: Num;
};

export type ClanLegendSummary = {
  seasons: Array<{ season: string; after: string; before: string; playerCount: Num }>;
  topFinishes: ClanLegendRow[];
};

export type ClanRecords = {
  clanPoints?: { value: Num; time: string };
  warWinStreak?: { value: Num; time: string };
};

export type ClanRankings = {
  name: string | null;
  tag: string;
  badge: string | null;
  homeVillage: { points: Num; placements: Array<{ locationId: string; rank: Num; points: Num }> };
  builderBase: { points: Num; placements: Array<{ locationId: string; rank: Num; points: Num }> };
  clanCapital: { points: Num; placements: Array<{ locationId: string; rank: Num; points: Num }> };
};

/* ---------- War ---------- */

export type WarAttack = {
  attackerTag: string;
  defenderTag: string;
  stars: Num;
  destructionPercentage: Num;
  order: Num;
  duration: Num;
};

export type WarMember = {
  tag: string;
  name: string;
  townhallLevel: Num;
  mapPosition: Num;
  attacks?: WarAttack[];
  opponentAttacks?: Num;
  bestOpponentAttack?: WarAttack;
};

export type WarSide = {
  tag: string;
  name: string;
  badgeUrls: { small: string; large: string; medium: string };
  clanLevel: Num;
  attacks: Num;
  stars: Num;
  destructionPercentage: Num;
  members?: WarMember[];
};

export type StoredWar = {
  state: string;
  teamSize: Num;
  attacksPerMember?: Num;
  battleModifier?: string;
  preparationStartTime: string;
  startTime?: string;
  endTime: string;
  clan: WarSide;
  opponent: WarSide;
  warStartTime?: string;
  tag?: string;
};

export type WarHitrateRow = {
  period: string;
  townHall: number;
  attacks: number;
  stars: Array<{ stars: number; count: number }>;
  averageStars: Num;
  averageDestruction: Num;
  averageDuration: Num;
};

/* ---------- CWL ---------- */

export type CwlSeasonRow = {
  season: string;
  state: string;
  warSize: Num | null;
  warLeague: { id: Num; name: string } | null;
  rank: Num | null;
  stars: Num | null;
  destruction: Num | null;
  rounds: { won: Num; tied: Num; lost: Num } | null;
};

export type CwlGroupClan = {
  tag: string;
  name: string;
  clanLevel: Num;
  badgeUrls: { small: string; large: string; medium: string };
  members: Array<{ tag: string; name: string; townHallLevel: Num }>;
};

export type CwlGroup = {
  state: string;
  season: string;
  warLeague: { id: Num; name: string } | null;
  clans: CwlGroupClan[];
  rounds: Array<{ warTags: Array<StoredWar | { tag: string }> }>;
};
