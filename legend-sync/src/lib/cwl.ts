import { toNum, type CwlGroup, type CwlGroupClan, type StoredWar } from "./api/types";
import { orient, type OurWar } from "./war";

export type CwlRound = { number: number; wars: StoredWar[] };

/** Rounds with only fully loaded wars. Entries that are bare tags (not fetched yet) are dropped. */
export function loadedRounds(group: CwlGroup): CwlRound[] {
  return group.rounds.map((round, i) => ({
    number: i + 1,
    wars: round.warTags.filter((w): w is StoredWar => "clan" in w),
  }));
}

export type Standing = {
  clan: CwlGroupClan;
  played: number;
  wins: number;
  losses: number;
  ties: number;
  stars: number;
  destruction: number;
};

/** Standings derived from finished wars: wins first, then stars, then destruction. */
export function computeStandings(group: CwlGroup): Standing[] {
  const map = new Map<string, Standing>();
  for (const clan of group.clans) {
    map.set(clan.tag, { clan, played: 0, wins: 0, losses: 0, ties: 0, stars: 0, destruction: 0 });
  }
  for (const round of loadedRounds(group)) {
    for (const war of round.wars) {
      if (war.state !== "warEnded") continue;
      for (const [mine, theirs] of [
        [war.clan, war.opponent],
        [war.opponent, war.clan],
      ] as const) {
        const row = map.get(mine.tag);
        if (!row) continue;
        const a = toNum(mine.stars) ?? 0;
        const b = toNum(theirs.stars) ?? 0;
        const da = toNum(mine.destructionPercentage) ?? 0;
        const db = toNum(theirs.destructionPercentage) ?? 0;
        row.played += 1;
        row.stars += a;
        row.destruction += da;
        if (a !== b ? a > b : da > db) row.wins += 1;
        else if (a === b && da === db) row.ties += 1;
        else row.losses += 1;
      }
    }
  }
  return [...map.values()].sort(
    (x, y) => y.wins - x.wins || y.stars - x.stars || y.destruction - x.destruction,
  );
}

export type OurRound = { number: number; war: OurWar | null };

export function ourRounds(group: CwlGroup, tag: string): OurRound[] {
  return loadedRounds(group).map((round) => {
    const war = round.wars.find((w) => w.clan.tag === tag || w.opponent.tag === tag);
    return { number: round.number, war: war ? orient(war, tag) : null };
  });
}

export function finishedWars(rounds: OurRound[]): OurWar[] {
  return rounds
    .filter((r): r is OurRound & { war: OurWar } => r.war !== null && r.war.war.state === "warEnded")
    .map((r) => r.war);
}
