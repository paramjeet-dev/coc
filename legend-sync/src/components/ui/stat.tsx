import type { ReactNode } from "react";
import { cn } from "cn";

type Tone = "gold" | "tide" | "ember" | "plain";

const TONE: Record<Tone, string> = {
  gold: "text-gold-300",
  tide: "text-tide-400",
  ember: "text-ember-400",
  plain: "text-ink-100",
};

export type StatItem = { label: ReactNode; value: ReactNode; tone?: Tone };

/** Mono caption over a mono number. Use inside a Panel or HeroPanel. */
export function StatGrid({
  items,
  className,
  size = "md",
}: {
  items: StatItem[];
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4", className)}>
      {items.map((item, i) => (
        <div key={i} className="min-w-0">
          <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-500">{item.label}</dt>
          <dd
            className={cn(
              "mt-1 truncate font-mono tabular-nums",
              size === "lg" ? "text-2xl font-semibold" : "text-lg",
              TONE[item.tone ?? "plain"],
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
