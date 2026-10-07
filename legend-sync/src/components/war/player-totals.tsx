"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { tagToSlug } from "@/lib/api/tags";
import { formatPercent } from "@/lib/format";
import type { PlayerWarTotals } from "@/lib/war";

type SortKey = "name" | "wars" | "avgStars" | "tripleRate" | "missed";
type Direction = "asc" | "desc";

const avgStars = (r: PlayerWarTotals) => (r.attacks ? r.stars / r.attacks : null);
const tripleRate = (r: PlayerWarTotals) => (r.attacks ? (r.triples / r.attacks) * 100 : null);

const COLUMNS: Array<{ key: SortKey; label: string; align: "left" | "right" }> = [
  { key: "name", label: "Player", align: "left" },
  { key: "wars", label: "Wars", align: "right" },
  { key: "avgStars", label: "Avg stars", align: "right" },
  { key: "tripleRate", label: "Triple rate", align: "right" },
  { key: "missed", label: "Missed", align: "right" },
];

function valueOf(r: PlayerWarTotals, key: SortKey): string | number | null {
  switch (key) {
    case "name":
      return r.name.toLowerCase();
    case "wars":
      return r.wars;
    case "avgStars":
      return avgStars(r);
    case "tripleRate":
      return tripleRate(r);
    case "missed":
      return r.missed;
  }
}

function SortArrows({
  label,
  active,
  onSort,
}: {
  label: string;
  active: Direction | null;
  onSort: (dir: Direction) => void;
}) {
  const base =
    "grid size-4 place-items-center rounded text-[0.6rem] leading-none outline-none focus-visible:ring-2 focus-visible:ring-gold-400";
  return (
    <span className="ml-1.5 inline-flex flex-col">
      <button
        type="button"
        onClick={() => onSort("asc")}
        aria-label={`Sort ${label} ascending`}
        aria-pressed={active === "asc"}
        className={`${base} ${active === "asc" ? "text-gold-300" : "text-ink-500 hover:text-ink-100"}`}
      >
        ▲
      </button>
      <button
        type="button"
        onClick={() => onSort("desc")}
        aria-label={`Sort ${label} descending`}
        aria-pressed={active === "desc"}
        className={`${base} ${active === "desc" ? "text-gold-300" : "text-ink-500 hover:text-ink-100"}`}
      >
        ▼
      </button>
    </span>
  );
}

export function PlayerTotals({ rows }: { rows: PlayerWarTotals[] }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: Direction }>({ key: "avgStars", dir: "desc" });

  const sorted = useMemo(() => {
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = valueOf(a, sort.key);
      const y = valueOf(b, sort.key);
      // Players without a value always sink to the bottom, whichever way we sort.
      if (x === null && y === null) return 0;
      if (x === null) return 1;
      if (y === null) return -1;
      const cmp = typeof x === "string" && typeof y === "string" ? x.localeCompare(y) : Number(x) - Number(y);
      return cmp * factor || a.name.localeCompare(b.name);
    });
  }, [rows, sort]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] text-left text-sm">
        <caption className="sr-only">Player totals across recent wars</caption>
        <thead className="text-ink-500">
          <tr className="border-b border-ink-800">
            {COLUMNS.map((c) => (
              <th
                key={c.key}
                scope="col"
                aria-sort={sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                className={`py-2 pr-3 font-medium ${c.align === "right" ? "text-right" : ""}`}
              >
                <span className="inline-flex items-center">
                  {c.label}
                  <SortArrows
                    label={c.label}
                    active={sort.key === c.key ? sort.dir : null}
                    onSort={(dir) => setSort({ key: c.key, dir })}
                  />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800 font-mono tabular-nums">
          {sorted.map((r) => {
            const avg = avgStars(r);
            return (
              <tr key={r.tag}>
                <th scope="row" className="py-2 pr-3 font-sans font-medium">
                  <Link href={`/player/${tagToSlug(r.tag)}/legends`} className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-gold-400">
                    {r.name}
                  </Link>
                </th>
                <td className="py-2 pr-3 text-right text-ink-300">{r.wars}</td>
                <td className="py-2 pr-3 text-right text-gold-300">{avg === null ? "n/a" : avg.toFixed(2)}</td>
                <td className="py-2 pr-3 text-right">{formatPercent(tripleRate(r), 0)}</td>
                <td className={`py-2 pr-3 text-right ${r.missed > 0 ? "text-ember-400" : "text-ink-500"}`}>{r.missed}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
