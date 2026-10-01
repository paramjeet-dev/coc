"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { palette } from "@/lib/palette";

type Point = { season: string; trophies: number };

const config = {
  trophies: { label: "Final trophies", color: palette.gold },
} satisfies ChartConfig;

export function SeasonHistoryChart({ data }: { data: Point[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-56 w-full">
      <LineChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="2 4" />
        <XAxis
          dataKey="season"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={28}
          stroke={palette.axis}
        />
        <YAxis
          domain={["dataMin - 100", "dataMax + 100"]}
          tickLine={false}
          axisLine={false}
          width={48}
          stroke={palette.axis}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="trophies"
          type="monotone"
          stroke="var(--color-trophies)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: palette.gold, strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
