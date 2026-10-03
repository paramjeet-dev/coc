import Link from "next/link";
import { MODE_FILTERS, RANGE_OPTIONS, type ModeFilter, type RangeDays } from "@/lib/battlelog";

type Props = { basePath: string; mode: ModeFilter; range: RangeDays; counts: Record<ModeFilter, number> };

function href(basePath: string, mode: ModeFilter, range: RangeDays) {
  return `${basePath}?mode=${mode}&range=${range}`;
}

export function Filters({ basePath, mode, range, counts }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <nav aria-label="Battle mode" className="flex flex-wrap gap-1.5">
        {MODE_FILTERS.map((m) => {
          const active = m.value === mode;
          return (
            <Link
              key={m.value}
              href={href(basePath, m.value, range)}
              scroll={false}
              aria-current={active ? "true" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none ${
                active ? "bg-gold-400 font-semibold text-ink-950" : "bg-ink-800 text-ink-300 hover:text-ink-100"
              }`}
            >
              {m.label}
              <span className={`ml-1.5 font-mono text-xs tabular-nums ${active ? "text-ink-800" : "text-ink-500"}`}>
                {counts[m.value]}
              </span>
            </Link>
          );
        })}
      </nav>
      <nav aria-label="Time window" className="flex items-center gap-1 text-sm">
        <span className="mr-1 text-ink-500">Last</span>
        {RANGE_OPTIONS.map((r) => (
          <Link
            key={r}
            href={href(basePath, mode, r)}
            scroll={false}
            aria-current={r === range ? "true" : undefined}
            className={`rounded-md px-2.5 py-1 font-mono tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
              r === range ? "bg-ink-700 text-ink-100" : "text-ink-300 hover:text-ink-100"
            }`}
          >
            {r}d
          </Link>
        ))}
      </nav>
    </div>
  );
}
