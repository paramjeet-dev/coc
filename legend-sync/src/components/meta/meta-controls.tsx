import Link from "next/link";
import { LinkPending } from "@/components/ui/link-pending";
import { SortMenu } from "./sort-menu";
import { COHORTS, SORTS, type SortKey } from "@/lib/meta";
import type { Cohort } from "@/lib/api/types";

type Props = { cohort: Cohort; sort: SortKey; army?: string };

function href(p: Props, next: Partial<Props>) {
  const m = { ...p, ...next };
  const q = new URLSearchParams({ cohort: m.cohort, sort: m.sort });
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
            <LinkPending /></Link>
          ))}
        </nav>
        <SortMenu
          current={props.sort}
          options={SORTS.map((o) => ({ value: o.value, label: o.label, href: href(props, { sort: o.value }) }))}
        />
      </div>
    </div>
  );
}
