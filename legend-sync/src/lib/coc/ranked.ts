import "server-only";
import type { APILeagueGroupList } from "clashofclans.js";
import type {
  LegendBattle,
  RankedBattlelog,
  RankedGroupLogEntry,
  RankedGroupMember,
  RankedLeagueGroup,
  RankedSeasonRecord,
} from "../api/types";
import { getOfficialClient, memo } from "./client";

const MINUTE = 60_000;

async function tierNames(): Promise<Map<number, string>> {
  return memo("coc:tiers", 24 * 60 * MINUTE, async () => {
    const client = await getOfficialClient();
    const tiers = await client.getLeaguesTiers();
    return new Map(tiers.map((t) => [t.id, t.name]));
  });
}

/**
 * Ranked seasons for a player from the official API.
 *
 * The official history has no league group tag, no Town Hall and no battle detail. The two most
 * recent seasons get a group tag because the player endpoint exposes current and previous group tags.
 */
export async function getOfficialRankedSeasons(tag: string): Promise<RankedSeasonRecord[]> {
  return memo(`coc:history:${tag}`, 5 * MINUTE, async () => {
    const client = await getOfficialClient();
    const [history, player, names] = await Promise.all([
      client.getLeagueHistory(tag),
      client.rest.getPlayer(tag).then((r) => r.body),
      tierNames(),
    ]);

    const groupBySeason = new Map<number, string>();
    if (player.previousLeagueSeasonId && player.previousLeagueGroupTag) {
      groupBySeason.set(player.previousLeagueSeasonId, player.previousLeagueGroupTag);
    }
    if (player.currentLeagueSeasonId && player.currentLeagueGroupTag) {
      groupBySeason.set(player.currentLeagueSeasonId, player.currentLeagueGroupTag);
    }

    return history.map((s) => ({
      mode: "ranked" as const,
      seasonId: String(s.leagueSeasonId),
      leagueGroupId: groupBySeason.get(s.leagueSeasonId) ?? "",
      league: { id: s.leagueTierId, name: names.get(s.leagueTierId) ?? `League tier ${s.leagueTierId}` },
      maxBattles: s.maxBattles,
      tag: player.tag,
      name: player.name,
      townHallLevel: null,
      attackLosses: s.attackLosses,
      attackStars: s.attackStars,
      attackWins: s.attackWins,
      defenseLosses: s.defenseLosses,
      defenseStars: s.defenseStars,
      defenseWins: s.defenseWins,
      leagueTrophies: s.leagueTrophies,
      placement: s.placement,
    }));
  });
}

type GroupMeta = Pick<RankedSeasonRecord, "seasonId" | "leagueGroupId" | "league" | "maxBattles" | "tag">;

/**
 * Group standings from the official API. Placement is derived by sorting on trophies, since the API does not send it.
 *
 * /leaguegroup/{leagueGroupTag}/{leagueSeasonId} also needs the playerTag query parameter. The attack and defense
 * logs it returns belong to that player. clashofclans.js accepts the option on the REST method but not on the
 * Client wrapper, so the REST method is called directly.
 */
export async function getOfficialRankedGroup(season: GroupMeta): Promise<RankedLeagueGroup | null> {
  if (!season.leagueGroupId) return null;
  return memo(`coc:group:${season.seasonId}:${season.leagueGroupId}:${season.tag}`, 10 * MINUTE, async () => {
    const client = await getOfficialClient();
    const group: APILeagueGroupList = await client.rest
      .getLeagueGroup(season.leagueGroupId, season.seasonId, { playerTag: season.tag })
      .then((r) => r.body);
    const members: RankedGroupMember[] = [...(group.members ?? [])]
      .sort((a, b) => b.leagueTrophies - a.leagueTrophies)
      .map((m, i) => ({
        tag: m.playerTag,
        name: m.playerName,
        townHallLevel: null,
        attackLosses: m.attackLoseCount,
        attackStars: null,
        attackWins: m.attackWinCount,
        defenseLosses: m.defenseLoseCount,
        defenseStars: null,
        defenseWins: m.defenseWinCount,
        leagueTrophies: m.leagueTrophies,
        placement: i + 1,
      }));
    return {
      leagueGroupId: season.leagueGroupId,
      seasonId: season.seasonId,
      league: season.league,
      maxBattles: season.maxBattles,
      members,
      attackLogs: (group.attackLogs ?? []).map(toLogEntry),
      defenseLogs: (group.defenseLogs ?? []).map(toLogEntry),
    };
  });
}

type OfficialLog = APILeagueGroupList["attackLogs"][number];

function toLogEntry(l: OfficialLog): RankedGroupLogEntry {
  return {
    opponentTag: l.opponentPlayerTag,
    opponentName: l.opponentName,
    stars: l.stars,
    destructionPercentage: l.destructionPercentage,
    trophies: l.trophies,
    time: l.creationTime,
  };
}

/** The official log has no Town Hall, duration or army code, so those fields are left empty. */
function toBattle(l: RankedGroupLogEntry): LegendBattle {
  return {
    time: l.time,
    townHallLevel: 0,
    opponent: { tag: l.opponentTag, name: l.opponentName, townHallLevel: 0 },
    stars: l.stars,
    destructionPercentage: l.destructionPercentage,
    duration: 0,
    shareCode: null,
    familyId: null,
    trophies: l.trophies,
  };
}

const newestFirst = (a: { time: string }, b: { time: string }) => b.time.localeCompare(a.time);

/** Builds the battle log shown on the ranked page from the group's attack and defense logs. */
export function battlelogFromGroup(
  group: RankedLeagueGroup,
  season: RankedSeasonRecord,
): RankedBattlelog | null {
  if (!group.attackLogs && !group.defenseLogs) return null;
  const attacks = [...(group.attackLogs ?? [])].sort(newestFirst).map(toBattle);
  const defenses = [...(group.defenseLogs ?? [])].sort(newestFirst).map(toBattle);
  const sum = (list: LegendBattle[]) => list.reduce((n, b) => n + b.trophies, 0);
  const attackTrophies = sum(attacks);
  const defenseTrophies = sum(defenses);
  return {
    tag: season.tag,
    seasonId: season.seasonId,
    leagueGroupId: season.leagueGroupId,
    league: season.league,
    maxBattles: season.maxBattles,
    registeredAttacks: attacks.length,
    registeredDefenses: defenses.length,
    attackTrophies,
    defenseTrophies,
    trophies: attackTrophies + defenseTrophies,
    attacks,
    defenses,
  };
}
