import { toNum, type BattleHistoryItem } from "./api/types";
import { parseBattleTime } from "./legend";

export type ModeFilter = "all" | BattleHistoryItem["battleMode"];

export const MODE_FILTERS: Array<{ value: ModeFilter; label: string }> = [
  { value: "all", label: "All modes" },
  { value: "legend", label: "Legend" },
  { value: "ranked", label: "Ranked" },
  { value: "farming", label: "Farming" },
];

export const RANGE_OPTIONS = [7, 14, 31] as const;
export type RangeDays = (typeof RANGE_OPTIONS)[number];

export function parseMode(raw: string | undefined): ModeFilter {
  return MODE_FILTERS.some((m) => m.value === raw) ? (raw as ModeFilter) : "all";
}

export function parseRange(raw: string | undefined): RangeDays {
  const n = Number(raw);
  return (RANGE_OPTIONS as readonly number[]).includes(n) ? (n as RangeDays) : 14;
}

export function newestFirst(items: BattleHistoryItem[]): BattleHistoryItem[] {
  return [...items].sort(
    (a, b) => parseBattleTime(b.battleTime).getTime() - parseBattleTime(a.battleTime).getTime(),
  );
}

export function filterByMode(items: BattleHistoryItem[], mode: ModeFilter): BattleHistoryItem[] {
  return mode === "all" ? items : items.filter((i) => i.battleMode === mode);
}

/** Calendar day in UTC, newest day first. Items inside a day keep the order they arrive in. */
export function groupByUtcDay(items: BattleHistoryItem[]): Array<{ day: string; items: BattleHistoryItem[] }> {
  const map = new Map<string, BattleHistoryItem[]>();
  for (const item of items) {
    const day = parseBattleTime(item.battleTime).toISOString().slice(0, 10);
    const list = map.get(day);
    if (list) list.push(item);
    else map.set(day, [item]);
  }
  return Array.from(map, ([day, list]) => ({ day, items: list }));
}

export type ModeSummary = {
  mode: BattleHistoryItem["battleMode"];
  attacks: number;
  stars: number;
  tripleRate: number | null;
  averageDestruction: number | null;
  averageDuration: number | null;
  gold: number;
  elixir: number;
  darkElixir: number;
};

export function summarizeByMode(items: BattleHistoryItem[]): ModeSummary[] {
  const modes: Array<BattleHistoryItem["battleMode"]> = ["legend", "ranked", "farming"];
  return modes.map((mode) => {
    const rows = items.filter((i) => i.battleMode === mode);
    const n = rows.length;
    return {
      mode,
      attacks: n,
      stars: rows.reduce((s, r) => s + r.stars, 0),
      tripleRate: n ? (rows.filter((r) => r.stars === 3).length / n) * 100 : null,
      averageDestruction: n
        ? rows.reduce((s, r) => s + (toNum(r.destructionPercentage) ?? 0), 0) / n
        : null,
      averageDuration: n ? rows.reduce((s, r) => s + r.duration, 0) / n : null,
      gold: rows.reduce((s, r) => s + (r.lootedResources?.gold ?? 0), 0),
      elixir: rows.reduce((s, r) => s + (r.lootedResources?.elixir ?? 0), 0),
      darkElixir: rows.reduce((s, r) => s + (r.lootedResources?.darkElixir ?? 0), 0),
    };
  });
}

export type ArmyUsage = {
  shareCode: string;
  familyId: string | null;
  uses: number;
  triples: number;
  averageDestruction: number;
  averageDuration: number;
  lastUsed: string;
};

/** Groups attacks by army share code. Rows without a code are skipped. */
export function armyUsage(items: BattleHistoryItem[]): ArmyUsage[] {
  const map = new Map<string, BattleHistoryItem[]>();
  for (const item of items) {
    if (!item.shareCode) continue;
    const list = map.get(item.shareCode);
    if (list) list.push(item);
    else map.set(item.shareCode, [item]);
  }
  return Array.from(map, ([shareCode, rows]) => {
    const latest = rows.reduce((a, b) =>
      parseBattleTime(a.battleTime).getTime() >= parseBattleTime(b.battleTime).getTime() ? a : b,
    );
    return {
      shareCode,
      familyId: rows.find((r) => r.familyId)?.familyId ?? null,
      uses: rows.length,
      triples: rows.filter((r) => r.stars === 3).length,
      averageDestruction: rows.reduce((s, r) => s + (toNum(r.destructionPercentage) ?? 0), 0) / rows.length,
      averageDuration: rows.reduce((s, r) => s + r.duration, 0) / rows.length,
      lastUsed: latest.battleTime,
    };
  }).sort((a, b) => b.uses - a.uses || b.triples - a.triples);
}
