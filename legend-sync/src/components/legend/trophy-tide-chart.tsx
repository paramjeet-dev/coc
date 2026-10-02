"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { palette } from "@/lib/palette";
import { shortDay } from "@/lib/legend";

type Point = { day: string; trophies: number };

const config = {
  trophies: { label: "Net trophies", color: palette.gold },
} satisfies ChartConfig;

export function TrophyTideChart({ data }: { data: Point[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-72 w-full">
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="tide-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-trophies)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--color-trophies)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="2 4" />
        <XAxis
          dataKey="day"
          tickFormatter={shortDay}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          stroke={palette.axis}
        />
        <YAxis
          domain={["dataMin - 25", "dataMax + 25"]}
          tickLine={false}
          axisLine={false}
          width={48}
          stroke={palette.axis}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey="trophies"
          type="monotone"
          stroke="var(--color-trophies)"
          strokeWidth={2.5}
          fill="url(#tide-fill)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
