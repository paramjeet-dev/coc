import Link from "next/link";
import { StatGrid } from "@/components/ui/stat";
import type { PerformanceDay } from "@/lib/legend";

type Props = { days: PerformanceDay[]; selectedDay: string | undefined; basePath: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Tier = { label: string; cell: string; swatch: string };

const TIERS = {
  loss: { label: "Below -15", cell: "bg-ember-400 text-ink-950", swatch: "bg-ember-400" },
  dip: { label: "-15 to -1", cell: "bg-ember-400/30 text-ink-100", swatch: "bg-ember-400/30" },
  flat: { label: "0 to 20", cell: "bg-ink-800 text-ink-100", swatch: "bg-ink-800" },
  solid: { label: "21 to 45", cell: "bg-gold-600/70 text-ink-100", swatch: "bg-gold-600/70" },
  apex: { label: "46 and up", cell: "bg-gold-400 text-ink-950", swatch: "bg-gold-400" },
} satisfies Record<string, Tier>;

function tierOf(net: number): Tier {
  if (net <= -16) return TIERS.loss;
  if (net < 0) return TIERS.dip;
  if (net <= 20) return TIERS.flat;
  if (net <= 45) return TIERS.solid;
  return TIERS.apex;
}

function signed(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}

/** Monday-first weekday index for a plain yyyy-mm-dd key. */
function weekdayIndex(key: string): number {
  return (new Date(`${key}T00:00:00Z`).getUTCDay() + 6) % 7;
}

function shortDate(key: string): string {
  const [, m, d] = key.split("-");
  return `${MONTHS[Number(m) - 1] ?? ""} ${Number(d)}`;
}

/** Calendar heatmap of daily net trophies. Each cell links to that day's inspector. */
export function PerformanceHeatmap({ days, selectedDay, basePath }: Props) {
  const first = days[0];
  if (!first) return null;
  const lead = weekdayIndex(first.day);

  const best = days.reduce((a, b) => (b.net > a.net ? b : a), first);
  const worst = days.reduce((a, b) => (b.net < a.net ? b : a), first);
  const positive = days.filter((d) => d.net > 0).length;
  const consistency = (positive / days.length) * 100;

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[30rem]">
          <div aria-hidden className="mb-1.5 grid grid-cols-7 gap-1.5 sm:gap-2">
            {WEEKDAYS.map((w) => (
              <span key={w} className="text-center font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-500">
                {w}
              </span>
            ))}
          </div>
          <ol className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {Array.from({ length: lead }, (_, i) => (
              <li key={`pad-${i}`} aria-hidden />
            ))}
            {days.map((d) => {
              const tier = tierOf(d.net);
              const selected = d.day === selectedDay;
              return (
                <li key={d.day}>
                  <Link
                    href={`${basePath}?day=${d.day}`}
                    scroll={false}
                    aria-current={selected ? "date" : undefined}
                    aria-label={`${shortDate(d.day)}: net ${signed(d.net)} trophies, ${signed(d.attackTrophies)} attacking, ${signed(d.defenseTrophies)} defending`}
                    title={`${shortDate(d.day)}: ${signed(d.attackTrophies)} attacking, ${signed(d.defenseTrophies)} defending`}
                    className={`flex h-[4.5rem] flex-col justify-between rounded-lg p-2 outline-none transition-transform hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-gold-300 motion-reduce:transition-none motion-reduce:hover:scale-100 ${tier.cell} ${
                      selected ? "ring-2 ring-ink-100" : ""
                    }`}
                  >
                    <span className="font-mono text-[0.65rem] opacity-70">{shortDate(d.day)}</span>
                    <span className="font-mono text-lg font-semibold leading-none tabular-nums">{signed(d.net)}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <ul aria-label="Colour key" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-300">
        {Object.values(TIERS).map((t) => (
          <li key={t.label} className="flex items-center gap-1.5">
            <span aria-hidden className={`size-3 rounded-[4px] ${t.swatch}`} />
            {t.label}
          </li>
        ))}
      </ul>

      <StatGrid
        className="mt-6 border-t border-ink-800 pt-5"
        items={[
          { label: "Best day", value: `${signed(best.net)}, ${shortDate(best.day)}`, tone: "gold" },
          { label: "Worst day", value: `${signed(worst.net)}, ${shortDate(worst.day)}`, tone: worst.net < 0 ? "ember" : "plain" },
          { label: "Positive days", value: `${positive} of ${days.length}` },
          { label: "Consistency", value: `${consistency.toFixed(1)}%`, tone: "tide" },
        ]}
      />
    </div>
  );
}
