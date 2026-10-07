import Link from "next/link";
import { WAR_KINDS, type WarKind } from "@/lib/war";

type Props = { basePath: string; active: WarKind; counts: Record<WarKind, number> };

/** Splits regular wars, Clan War League wars and friendlies into their own views. */
export function WarKindTabs({ basePath, active, counts }: Props) {
  return (
    <nav aria-label="War type" className="flex flex-wrap gap-1.5">
      {WAR_KINDS.filter((k) => counts[k.value] > 0 || k.value === active).map((k) => (
        <Link
          key={k.value}
          href={`${basePath}?kind=${k.value}`}
          scroll={false}
          aria-current={k.value === active ? "true" : undefined}
          className={`rounded-full px-3.5 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none ${
            k.value === active ? "bg-gold-400 font-semibold text-ink-950" : "bg-ink-800 text-ink-300 hover:text-ink-100"
          }`}
        >
          {k.label}
          <span className="ml-1.5 font-mono text-xs tabular-nums opacity-70">{counts[k.value]}</span>
        </Link>
      ))}
    </nav>
  );
}
