import { toNum, type StoredWar, type WarAttack, type WarHitrateRow, type WarMember, type WarSide } from "./api/types";

export type WarResult = "win" | "loss" | "tie";

export type OurWar = {
  war: StoredWar;
  us: WarSide;
  them: WarSide;
  result: WarResult;
  slug: string;
};

/** Orient a stored war so `us` is always the clan being viewed. */
export function orient(war: StoredWar, tag: string): OurWar {
  const swap = war.clan.tag !== tag && war.opponent.tag === tag;
  const us = swap ? war.opponent : war.clan;
  const them = swap ? war.clan : war.opponent;
  const a = toNum(us.stars) ?? 0;
  const b = toNum(them.stars) ?? 0;
  const da = toNum(us.destructionPercentage) ?? 0;
  const db = toNum(them.destructionPercentage) ?? 0;
  const result: WarResult = a !== b ? (a > b ? "win" : "loss") : da !== db ? (da > db ? "win" : "loss") : "tie";
  return { war, us, them, result, slug: war.endTime };
}

export function endedOnly(wars: StoredWar[]): StoredWar[] {
  return wars
    .filter((w) => w.state === "warEnded")
    .sort((a, b) => b.endTime.localeCompare(a.endTime));
}

export type WarRecord = {
  played: number;
  wins: number;
  losses: number;
  ties: number;
  winRate: number | null;
  averageStars: number | null;
  averageDestruction: number | null;
  tripleRate: number | null;
  attacksUsed: number;
  attacksAvailable: number;
  missedAttacks: number;
};

export function warRecord(wars: OurWar[]): WarRecord {
  let attacksUsed = 0;
  let attacksAvailable = 0;
  let stars = 0;
  let destruction = 0;
  let triples = 0;
  for (const { war, us } of wars) {
    const per = toNum(war.attacksPerMember) ?? 2;
    const members = us.members ?? [];
    attacksAvailable += members.length * per;
    for (const m of members) {
      for (const atk of m.attacks ?? []) {
        attacksUsed += 1;
        const s = toNum(atk.stars) ?? 0;
        stars += s;
        destruction += toNum(atk.destructionPercentage) ?? 0;
        if (s === 3) triples += 1;
      }
    }
  }
  const wins = wars.filter((w) => w.result === "win").length;
  const losses = wars.filter((w) => w.result === "loss").length;
  const ties = wars.filter((w) => w.result === "tie").length;
  return {
    played: wars.length,
    wins,
    losses,
    ties,
    winRate: wars.length ? (wins / wars.length) * 100 : null,
    averageStars: attacksUsed ? stars / attacksUsed : null,
    averageDestruction: attacksUsed ? destruction / attacksUsed : null,
    tripleRate: attacksUsed ? (triples / attacksUsed) * 100 : null,
    attacksUsed,
    attacksAvailable,
    missedAttacks: Math.max(attacksAvailable - attacksUsed, 0),
  };
}

export type MemberLine = {
  tag: string;
  name: string;
  townHall: number | null;
  position: number | null;
  attacks: WarAttack[];
  missed: number;
  stars: number;
  defenseStars: number | null;
};

/** One row per member of `side`, including attacks they did not use. */
export function memberLines(side: WarSide, attacksPerMember: number): MemberLine[] {
  return [...(side.members ?? [])]
    .sort((a, b) => (toNum(a.mapPosition) ?? 99) - (toNum(b.mapPosition) ?? 99))
    .map((m: WarMember) => {
      const attacks = m.attacks ?? [];
      return {
        tag: m.tag,
        name: m.name,
        townHall: toNum(m.townhallLevel),
        position: toNum(m.mapPosition),
        attacks,
        missed: Math.max(attacksPerMember - attacks.length, 0),
        stars: attacks.reduce((s, a) => s + (toNum(a.stars) ?? 0), 0),
        defenseStars: m.bestOpponentAttack ? toNum(m.bestOpponentAttack.stars) : null,
      };
    });
}

export type PlayerWarTotals = {
  tag: string;
  name: string;
  townHall: number | null;
  wars: number;
  attacks: number;
  stars: number;
  triples: number;
  missed: number;
};

/** Per-player totals across the given wars, best average stars first. */
export function playerTotals(wars: OurWar[]): PlayerWarTotals[] {
  const map = new Map<string, PlayerWarTotals>();
  for (const { war, us } of wars) {
    const per = toNum(war.attacksPerMember) ?? 2;
    for (const m of us.members ?? []) {
      const row =
        map.get(m.tag) ??
        { tag: m.tag, name: m.name, townHall: toNum(m.townhallLevel), wars: 0, attacks: 0, stars: 0, triples: 0, missed: 0 };
      const atks = m.attacks ?? [];
      row.wars += 1;
      row.attacks += atks.length;
      row.stars += atks.reduce((s, a) => s + (toNum(a.stars) ?? 0), 0);
      row.triples += atks.filter((a) => toNum(a.stars) === 3).length;
      row.missed += Math.max(per - atks.length, 0);
      map.set(m.tag, row);
    }
  }
  return [...map.values()].sort(
    (a, b) => (b.attacks ? b.stars / b.attacks : -1) - (a.attacks ? a.stars / a.attacks : -1) || b.wars - a.wars,
  );
}

export type ThHitRate = { townHall: number; attacks: number; tripleRate: number; averageStars: number };

/** Collapses monthly rows into one line per Town Hall, weighted by attack count. */
export function hitRateByTownHall(rows: WarHitrateRow[]): ThHitRate[] {
  const map = new Map<number, { attacks: number; triples: number; stars: number }>();
  for (const r of rows) {
    const cur = map.get(r.townHall) ?? { attacks: 0, triples: 0, stars: 0 };
    cur.attacks += r.attacks;
    cur.triples += r.stars.find((s) => s.stars === 3)?.count ?? 0;
    cur.stars += r.stars.reduce((s, x) => s + x.stars * x.count, 0);
    map.set(r.townHall, cur);
  }
  return [...map]
    .filter(([, v]) => v.attacks >= 50)
    .map(([townHall, v]) => ({
      townHall,
      attacks: v.attacks,
      tripleRate: (v.triples / v.attacks) * 100,
      averageStars: v.stars / v.attacks,
    }))
    .sort((a, b) => b.townHall - a.townHall);
}
