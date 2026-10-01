import { toNum, type BattleHistoryItem } from "./api/types";

/** Accepts ISO strings and the compact Clash format 20261001T120000.000Z. */
export function parseBattleTime(value: string): Date {
  const compact = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/.exec(value);
  if (compact) {
    const [, y, mo, d, h, mi, s] = compact;
    return new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s)));
  }
  return new Date(value);
}

/** A Legend day runs 05:00 UTC to 05:00 UTC, so shift back five hours before taking the date. */
export function legendDayKey(date: Date): string {
  return new Date(date.getTime() - 5 * 3_600_000).toISOString().slice(0, 10);
}

export function groupLegendAttacks(items: BattleHistoryItem[]): Map<string, BattleHistoryItem[]> {
  const byDay = new Map<string, BattleHistoryItem[]>();
  const legend = items
    .filter((item) => item.battleMode === "legend")
    .sort((a, b) => parseBattleTime(a.battleTime).getTime() - parseBattleTime(b.battleTime).getTime());

  for (const item of legend) {
    const key = legendDayKey(parseBattleTime(item.battleTime));
    const list = byDay.get(key);
    if (list) list.push(item);
    else byDay.set(key, [item]);
  }
  return byDay;
}

export type AttackSummary = {
  attacks: number;
  tripleRate: number | null;
  zeroRate: number | null;
  averageDestruction: number | null;
  averageDuration: number | null;
};

export function summarizeAttacks(items: BattleHistoryItem[]): AttackSummary {
  const legend = items.filter((item) => item.battleMode === "legend");
  const attacks = legend.length;
  if (attacks === 0) {
    return { attacks, tripleRate: null, zeroRate: null, averageDestruction: null, averageDuration: null };
  }
  const triples = legend.filter((i) => i.stars === 3).length;
  const zeros = legend.filter((i) => i.stars === 0).length;
  const destruction = legend.map((i) => toNum(i.destructionPercentage) ?? 0);
  return {
    attacks,
    tripleRate: (triples / attacks) * 100,
    zeroRate: (zeros / attacks) * 100,
    averageDestruction: destruction.reduce((a, b) => a + b, 0) / attacks,
    averageDuration: legend.reduce((sum, i) => sum + i.duration, 0) / attacks,
  };
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) return "n/a";
  const whole = Math.round(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export function shortDay(day: string): string {
  const [, month, date] = day.split("-");
  return month && date ? `${Number(month)}/${Number(date)}` : day;
}
