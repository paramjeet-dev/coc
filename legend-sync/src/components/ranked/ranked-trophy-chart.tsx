"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { palette } from "@/lib/palette";

type Point = { season: string; trophies: number };

const config = {
  trophies: { label: "League trophies", color: palette.tide },
} satisfies ChartConfig;

export function RankedTrophyChart({ data }: { data: Point[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-56 w-full">
      <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="2 4" />
        <XAxis dataKey="season" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} stroke={palette.axis} />
        <YAxis tickLine={false} axisLine={false} width={44} stroke={palette.axis} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Bar dataKey="trophies" fill="var(--color-trophies)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  );
}
