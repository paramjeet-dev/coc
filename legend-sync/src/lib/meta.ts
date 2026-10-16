import { armyKey, autoArmyName, decodeArmy } from "./army";
import { toNum, type ArmyFamily, type ArmyTimeline, type ArmyTimelineDay, type Cohort, type StarCounts } from "./api/types";

export const COHORTS: Array<{ value: Cohort; label: string; hint: string }> = [
  { value: "top_200", label: "Top 200", hint: "The 200 highest ranked players" },
  { value: "top_1000", label: "Top 1000", hint: "The 1000 highest ranked players" },
  { value: "legend_i", label: "Legend I", hint: "Everyone in the Legend league" },
];

export const SORTS = [
  { value: "usage", label: "Most used" },
  { value: "tripleRate", label: "Triple rate" },
  { value: "averageDestruction", label: "Destruction" },
  { value: "averageDuration", label: "Duration" },
] as const;
export type SortKey = (typeof SORTS)[number]["value"];

export function parseCohort(raw: string | undefined): Cohort {
  return COHORTS.some((c) => c.value === raw) ? (raw as Cohort) : "top_200";
}
export function parseSort(raw: string | undefined): SortKey {
  return SORTS.some((s) => s.value === raw) ? (raw as SortKey) : "usage";
}

export function totalAttacks(s: StarCounts): number {
  return s.zero + s.one + s.two + s.three;
}

export function tripleRate(s: StarCounts): number | null {
  const n = totalAttacks(s);
  return n > 0 ? (s.three / n) * 100 : null;
}

export function zeroStarRate(s: StarCounts): number | null {
  const n = totalAttacks(s);
  return n > 0 ? (s.zero / n) * 100 : null;
}

export function usageShare(f: ArmyFamily): number | null {
  return f.totalLegendAttacks > 0 ? (f.attacks / f.totalLegendAttacks) * 100 : null;
}

export function describeFamily(f: ArmyFamily): string {
  const named = f.name?.trim();
  if (named) return named;
  const decoded = decodeArmy(f.shareCode);
  return decoded ? autoArmyName(decoded) : `Army ${f.shareCode.slice(0, 8)}`;
}

/** Daily triple rate and usage, oldest first, ready for charting. */
export function timelineSeries(days: ArmyTimelineDay[]) {
  return [...days]
    .sort((a, b) => a.day.localeCompare(b.day))
    .map((d) => ({
      day: d.day.slice(5),
      triple: Number((tripleRate(d.starCounts) ?? 0).toFixed(1)),
      usage: Number((d.totalLegendAttacks > 0 ? (d.attacks / d.totalLegendAttacks) * 100 : 0).toFixed(1)),
      destruction: Number((toNum(d.averageDestruction) ?? 0).toFixed(1)),
    }));
}

function weighted<T>(rows: T[], weight: (r: T) => number, value: (r: T) => number | null): number | null {
  let total = 0;
  let sum = 0;
  for (const r of rows) {
    const v = value(r);
    const w = weight(r);
    if (v !== null && w > 0) {
      sum += v * w;
      total += w;
    }
  }
  return total > 0 ? sum / total : null;
}

function addStars(rows: StarCounts[]): StarCounts {
  return rows.reduce(
    (acc, s) => ({ zero: acc.zero + s.zero, one: acc.one + s.one, two: acc.two + s.two, three: acc.three + s.three }),
    { zero: 0, one: 0, two: 0, three: 0 },
  );
}

/**
 * The API tracks families by exact code, so near identical armies show up as separate rows.
 * Merge rows that share an army key, add their attacks and star counts, and weight the averages.
 */
export function mergeFamilies(list: ArmyFamily[], sort: SortKey, limit: number): ArmyFamily[] {
  const groups = new Map<string, ArmyFamily[]>();
  for (const f of list) {
    const key = armyKey(f.shareCode);
    const group = groups.get(key);
    if (group) group.push(f);
    else groups.set(key, [f]);
  }

  const merged = Array.from(groups.values(), (members): ArmyFamily => {
    const ranked = [...members].sort((a, b) => b.attacks - a.attacks);
    const rep = ranked[0]!;
    if (ranked.length === 1) return { ...rep, variantCodes: [rep.shareCode] };
    return {
      ...rep,
      attacks: ranked.reduce((s, m) => s + m.attacks, 0),
      players: null,
      starCounts: addStars(ranked.map((m) => m.starCounts)),
      averageDuration: weighted(ranked, (m) => m.attacks, (m) => toNum(m.averageDuration)),
      averageDestruction: weighted(ranked, (m) => m.attacks, (m) => toNum(m.averageDestruction)),
      variantCodes: ranked.map((m) => m.shareCode),
    };
  });

  const metric = (f: ArmyFamily): number => {
    switch (sort) {
      case "tripleRate":
        return tripleRate(f.starCounts) ?? -1;
      case "averageDestruction":
        return toNum(f.averageDestruction) ?? -1;
      case "averageDuration":
        return toNum(f.averageDuration) ?? -1;
      default:
        return f.attacks;
    }
  };
  return merged.sort((a, b) => metric(b) - metric(a)).slice(0, limit);
}

/** Combine the daily timelines of several variant codes into one. */
export function mergeTimelines(timelines: ArmyTimeline[]): ArmyTimeline | null {
  const first = timelines[0];
  if (!first) return null;
  if (timelines.length === 1) return first;

  const byDay = new Map<string, ArmyTimelineDay[]>();
  for (const t of timelines) {
    for (const d of t.items) {
      const list = byDay.get(d.day);
      if (list) list.push(d);
      else byDay.set(d.day, [d]);
    }
  }
  const items = Array.from(byDay, ([day, rows]): ArmyTimelineDay => ({
    day,
    totalLegendAttacks: Math.max(...rows.map((r) => r.totalLegendAttacks)),
    attacks: rows.reduce((s, r) => s + r.attacks, 0),
    players: rows.reduce((s, r) => s + r.players, 0),
    starCounts: addStars(rows.map((r) => r.starCounts)),
    averageDuration: weighted(rows, (r) => r.attacks, (r) => toNum(r.averageDuration)),
    averageDestruction: weighted(rows, (r) => r.attacks, (r) => toNum(r.averageDestruction)),
  })).sort((a, b) => a.day.localeCompare(b.day));
  return { ...first, items };
}
