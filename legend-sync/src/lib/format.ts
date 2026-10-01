import { toNum, type Num } from "./api/types";

const integer = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export function formatInt(value: Num | null | undefined): string {
  const n = toNum(value);
  return n === null ? "n/a" : integer.format(n);
}

export function formatCompact(value: Num | null | undefined): string {
  const n = toNum(value);
  return n === null ? "n/a" : compact.format(n);
}

export function formatPercent(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "n/a";
  return `${value.toFixed(digits)}%`;
}
