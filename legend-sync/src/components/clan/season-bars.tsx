"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { palette } from "@/lib/palette";

type Point = { season: string; players: number; top: number };

const config = {
  players: { label: "Legend players", color: palette.tide },
} satisfies ChartConfig;

export function SeasonBars({ data }: { data: Point[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-52 w-full">
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="2 4" />
        <XAxis dataKey="season" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} stroke={palette.axis} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} stroke={palette.axis} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Bar dataKey="players" fill="var(--color-players)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  );
}
