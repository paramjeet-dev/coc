import { toNum, type ArmyFamily, type ArmyTimelineDay, type Cohort, type StarCounts } from "./api/types";

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

export const WINDOWS = [3, 7, 14] as const;
export type WindowDays = (typeof WINDOWS)[number];

export function parseCohort(raw: string | undefined): Cohort {
  return COHORTS.some((c) => c.value === raw) ? (raw as Cohort) : "top_200";
}
export function parseSort(raw: string | undefined): SortKey {
  return SORTS.some((s) => s.value === raw) ? (raw as SortKey) : "usage";
}
export function parseWindow(raw: string | undefined): WindowDays {
  const n = Number(raw);
  return (WINDOWS as readonly number[]).includes(n) ? (n as WindowDays) : 7;
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
  return f.name?.trim() || `Army ${f.shareCode.slice(0, 8)}`;
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
