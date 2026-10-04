import Link from "next/link";
import { COHORTS, SORTS, WINDOWS, type SortKey, type WindowDays } from "@/lib/meta";
import type { Cohort } from "@/lib/api/types";

type Props = { cohort: Cohort; sort: SortKey; window: WindowDays; army?: string };

function href(p: Props, next: Partial<Props>) {
  const m = { ...p, ...next };
  const q = new URLSearchParams({ cohort: m.cohort, sort: m.sort, window: String(m.window) });
  if (m.army) q.set("army", m.army);
  return `/meta?${q.toString()}`;
}

const pill = (active: boolean) =>
  `rounded-full px-3.5 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none ${
    active ? "bg-gold-400 font-semibold text-ink-950" : "bg-ink-800 text-ink-300 hover:text-ink-100"
  }`;

export function MetaControls(props: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Cohort" className="flex flex-wrap gap-1.5">
          {COHORTS.map((c) => (
            <Link
              key={c.value}
              href={href(props, { cohort: c.value })}
              scroll={false}
              title={c.hint}
              aria-current={c.value === props.cohort ? "true" : undefined}
              className={pill(c.value === props.cohort)}
            >
              {c.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Time window" className="flex items-center gap-1 text-sm">
          <span className="mr-1 text-ink-500">Last</span>
          {WINDOWS.map((w) => (
            <Link
              key={w}
              href={href(props, { window: w })}
              scroll={false}
              aria-current={w === props.window ? "true" : undefined}
              className={`rounded-md px-2.5 py-1 font-mono tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                w === props.window ? "bg-ink-700 text-ink-100" : "text-ink-300 hover:text-ink-100"
              }`}
            >
              {w}d
            </Link>
          ))}
        </nav>
      </div>
      <nav aria-label="Sort armies" className="flex flex-wrap items-center gap-1 text-sm">
        <span className="mr-1 text-ink-500">Sort by</span>
        {SORTS.map((s) => (
          <Link
            key={s.value}
            href={href(props, { sort: s.value })}
            scroll={false}
            aria-current={s.value === props.sort ? "true" : undefined}
            className={`rounded-md px-2.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
              s.value === props.sort ? "bg-ink-700 text-ink-100" : "text-ink-300 hover:text-ink-100"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
