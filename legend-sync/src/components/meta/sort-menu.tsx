"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ListFilter } from "lucide-react";
import { LinkPending } from "@/components/ui/link-pending";

type Option = { value: string; label: string; href: string };

/** Filter icon on the right of the controls. Opens a small menu of sort options. */
export function SortMenu({ options, current }: { options: Option[]; current: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const active = options.find((o) => o.value === current);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Sort armies, currently ${active?.label ?? "default"}`}
        className={`inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm outline-none ring-1 transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none ${
          open ? "bg-ink-800 text-ink-100 ring-gold-400/50" : "bg-ink-900 text-ink-300 ring-ink-700 hover:text-ink-100"
        }`}
      >
        <ListFilter aria-hidden className="size-4" />
        <span className="hidden sm:inline">{active?.label ?? "Sort"}</span>
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Sort armies by"
          className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-ink-700 bg-ink-900 p-1 shadow-2xl shadow-black/50"
        >
          <p className="px-3 pb-1 pt-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-500">Sort by</p>
          {options.map((o) => {
            const selected = o.value === current;
            return (
              <Link
                key={o.value}
                href={o.href}
                scroll={false}
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm outline-none focus-visible:bg-ink-800 ${
                  selected ? "bg-ink-800 text-gold-300" : "text-ink-300 hover:bg-ink-850 hover:text-ink-100"
                }`}
              >
                <span className="flex items-center">
                  {o.label}
                  <LinkPending />
                </span>
                {selected && <Check aria-hidden className="size-4" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
