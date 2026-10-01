"use client";

import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { palette } from "@/lib/palette";
import { shortDay } from "@/lib/legend";

type Point = { day: string; attack: number; defense: number };

const config = {
  attack: { label: "Attack gains", color: palette.tide },
  defense: { label: "Defense losses", color: palette.ember },
} satisfies ChartConfig;

export function AttackDefenseChart({ data }: { data: Point[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={data} stackOffset="sign" margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="2 4" />
        <XAxis
          dataKey="day"
          tickFormatter={shortDay}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={20}
          stroke={palette.axis}
        />
        <YAxis tickLine={false} axisLine={false} width={40} stroke={palette.axis} />
        <ReferenceLine y={0} stroke={palette.axis} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="attack" stackId="net" fill="var(--color-attack)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="defense" stackId="net" fill="var(--color-defense)" radius={[0, 0, 3, 3]} />
      </BarChart>
    </ChartContainer>
  );
}
