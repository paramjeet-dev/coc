/** Literal colors for chart config. Tailwind only emits theme variables that utilities use, so charts take literals. */
export const palette = {
  gold: "oklch(0.82 0.15 85)",
  goldSoft: "oklch(0.62 0.13 75)",
  tide: "oklch(0.8 0.1 200)",
  ember: "oklch(0.7 0.17 40)",
  grid: "oklch(0.31 0.007 85)",
  axis: "oklch(0.55 0.01 85)",
} as const;
