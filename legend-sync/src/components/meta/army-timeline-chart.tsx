"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { palette } from "@/lib/palette";

type Point = { day: string; triple: number; usage: number };

const config = {
  triple: { label: "Triple rate %", color: palette.gold },
  usage: { label: "Usage share %", color: palette.tide },
} satisfies ChartConfig;

export function ArmyTimelineChart({ data }: { data: Point[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-52 w-full">
      <LineChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="2 4" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} minTickGap={20} stroke={palette.axis} />
        <YAxis tickLine={false} axisLine={false} width={36} stroke={palette.axis} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line dataKey="triple" type="monotone" stroke="var(--color-triple)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
        <Line dataKey="usage" type="monotone" stroke="var(--color-usage)" strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
      </LineChart>
    </ChartContainer>
  );
}
