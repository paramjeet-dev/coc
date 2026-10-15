"use client";

import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { palette } from "@/lib/palette";
import { compactTrophies, shortDay, type PerformanceDay } from "@/lib/legend";

type Metric = "trophies" | "net" | "attackAvg" | "defenseAvg";

const TABS: Array<{ id: Metric; label: string; blurb: string }> = [
  { id: "trophies", label: "Trophies", blurb: "Total trophies at the end of each Legend day." },
  { id: "net", label: "Net", blurb: "Trophies gained minus trophies lost, one bar per day." },
  { id: "attackAvg", label: "Attack avg", blurb: "Average trophies won per attack each day." },
  { id: "defenseAvg", label: "Defense avg", blurb: "Average trophies lost per defense each day." },
];

const config = {
  trophies: { label: "Trophies", color: palette.gold },
  net: { label: "Net", color: palette.gold },
  attackAvg: { label: "Attack avg", color: palette.tide },
  defenseAvg: { label: "Defense avg", color: palette.ember },
} satisfies ChartConfig;

function average(values: Array<number | null>): number | null {
  const nums = values.filter((v): v is number => v !== null);
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
}

function signed(n: number, digits = 0): string {
  const text = n.toFixed(digits);
  return n > 0 ? `+${text}` : text;
}

function headline(metric: Metric, data: PerformanceDay[]): { label: string; value: string } {
  const last = data[data.length - 1];
  if (metric === "trophies") return { label: "Latest total", value: last ? last.trophies.toLocaleString("en-US") : "n/a" };
  if (metric === "net") {
    const avg = average(data.map((d) => d.net));
    return { label: "Average per day", value: avg === null ? "n/a" : signed(avg, 1) };
  }
  const avg = average(data.map((d) => d[metric]));
  return {
    label: metric === "attackAvg" ? "Average per attack" : "Average per defense",
    value: avg === null ? "n/a" : signed(avg, 1),
  };
}

const axisProps = {
  tickLine: false,
  axisLine: false,
  stroke: palette.axis,
} as const;

export function LegendPerformanceChart({ data }: { data: PerformanceDay[] }) {
  const [metric, setMetric] = useState<Metric>("trophies");
  const tab = TABS.find((t) => t.id === metric) ?? TABS[0]!;
  const stat = headline(metric, data);
  const hasData = metric === "trophies" || metric === "net" || data.some((d) => d[metric] !== null);

  const x = (
    <XAxis dataKey="day" tickFormatter={shortDay} tickMargin={8} minTickGap={24} {...axisProps} />
  );
  const grid = <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="2 4" />;
  const tooltip = <ChartTooltip content={<ChartTooltipContent indicator="line" />} />;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-500">{stat.label}</p>
          <p className="font-mono text-3xl font-semibold tabular-nums text-gold-300">{stat.value}</p>
        </div>
        <div role="tablist" aria-label="Chart metric" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-ink-850 p-1 ring-1 ring-ink-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={metric === t.id}
              onClick={() => setMetric(t.id)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none ${
                metric === t.id ? "bg-gold-400 text-ink-950" : "text-ink-300 hover:text-ink-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-sm text-ink-300">{tab.blurb}</p>

      {!hasData ? (
        <p className="grid h-64 place-items-center rounded-xl bg-ink-850 px-6 text-center text-sm text-ink-300 ring-1 ring-ink-800">
          Attack and defense counts are not available for these days yet.
        </p>
      ) : (
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          {metric === "trophies" ? (
            <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="perf-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-trophies)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-trophies)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              {grid}
              {x}
              <YAxis
                domain={[
                  (min: number) => Math.floor((min - 40) / 50) * 50,
                  (max: number) => Math.ceil((max + 40) / 50) * 50,
                ]}
                tickFormatter={compactTrophies}
                width={48}
                {...axisProps}
              />
              {tooltip}
              <Area dataKey="trophies" type="monotone" stroke="var(--color-trophies)" strokeWidth={2.5} fill="url(#perf-fill)" isAnimationActive={false} />
            </AreaChart>
          ) : metric === "net" ? (
            <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
              {grid}
              {x}
              <YAxis width={40} {...axisProps} />
              <ReferenceLine y={0} stroke={palette.axis} />
              {tooltip}
              <Bar dataKey="net" radius={[3, 3, 3, 3]} isAnimationActive={false}>
                {data.map((d) => (
                  <Cell key={d.day} fill={d.net >= 0 ? palette.gold : palette.ember} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
              {grid}
              {x}
              <YAxis width={44} domain={["auto", "auto"]} tickFormatter={(v: number) => v.toFixed(0)} {...axisProps} />
              {tooltip}
              <Line
                dataKey={metric}
                type="monotone"
                stroke={`var(--color-${metric})`}
                strokeWidth={2.5}
                dot={{ r: 3, fill: `var(--color-${metric})` }}
                isAnimationActive={false}
                connectNulls={false}
              />
            </LineChart>
          )}
        </ChartContainer>
      )}
    </div>
  );
}
