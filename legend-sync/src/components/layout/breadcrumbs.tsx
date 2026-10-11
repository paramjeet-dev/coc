"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABEL: Record<string, string> = {
  player: "Players",
  meta: "Meta armies",
  clans: "Clans",
  war: "War",
  legends: "Legends",
  ranked: "Ranked",
  battlelog: "Battle log",
  cwl: "Clan War League",
};

/** Overview / Players / #TAG, built from the current path. */
export function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((part, i) => ({
    href: `/${parts.slice(0, i + 1).join("/")}`,
    label: LABEL[part] ?? `#${decodeURIComponent(part).toUpperCase()}`,
    mono: !LABEL[part],
  }));

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-2 font-mono text-xs text-ink-500">
        <li>
          <Link href="/" className="outline-none hover:text-ink-100 focus-visible:text-gold-300">
            Overview
          </Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex min-w-0 items-center gap-2">
            <span aria-hidden className="text-ink-700">/</span>
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className={`truncate text-ink-100 ${c.mono ? "tabular-nums" : ""}`}>
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="truncate outline-none hover:text-ink-100 focus-visible:text-gold-300">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
