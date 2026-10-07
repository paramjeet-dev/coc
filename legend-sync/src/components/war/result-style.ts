import type { OurWar } from "@/lib/war";

type ResultStyle = { label: string; headline: string; row: string; rowActive: string; badge: string };

/** Green for a win, red for a loss, grey for a tie, like the in-game war result screen. */
export const RESULT_STYLE: Record<OurWar["result"], ResultStyle> = {
  win: {
    label: "Win",
    headline: "Victory",
    row: "bg-emerald-500/15 hover:bg-emerald-500/25",
    rowActive: "bg-emerald-500/25 ring-1 ring-emerald-400",
    badge: "bg-emerald-500 text-emerald-950",
  },
  loss: {
    label: "Loss",
    headline: "Defeat",
    row: "bg-red-500/15 hover:bg-red-500/25",
    rowActive: "bg-red-500/25 ring-1 ring-red-400",
    badge: "bg-red-500 text-red-950",
  },
  tie: {
    label: "Tie",
    headline: "Draw",
    row: "bg-zinc-500/15 hover:bg-zinc-500/25",
    rowActive: "bg-zinc-500/25 ring-1 ring-zinc-400",
    badge: "bg-zinc-400 text-zinc-950",
  },
};
