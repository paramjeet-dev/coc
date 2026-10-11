import Link from "next/link";
import type { ReactNode } from "react";
import { PlayerSearch } from "@/components/search/player-search";
import { Breadcrumbs } from "./breadcrumbs";
import { MobileLinks, SidebarLinks } from "./nav-links";

function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
    >
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-xl bg-gold-400 font-mono text-base font-bold text-ink-950"
      >
        L
      </span>
      <span className="leading-tight">
        <span className="block text-base font-semibold tracking-tight">Legend Sync</span>
        <span className="block font-mono text-[0.68rem] text-ink-500">Clash of Clans stats</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-ink-800 bg-ink-950 p-4 lg:flex">
        <div className="px-1 pb-6 pt-1">
          <Brand />
        </div>
        <p className="mb-2 px-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-ink-500">Command</p>
        <SidebarLinks />
        <p className="mt-auto rounded-xl bg-ink-900 p-3 font-mono text-[0.68rem] leading-relaxed text-ink-500 ring-1 ring-ink-800">
          Data from the ClashKing API. Not affiliated with Supercell.
        </p>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-ink-800 bg-ink-950/85 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="lg:hidden">
              <Brand />
            </div>
            <div className="hidden min-w-0 lg:block">
              <Breadcrumbs />
            </div>
            <div className="w-full max-w-xs sm:max-w-sm">
              <PlayerSearch size="bar" placeholder="Search player name or tag" />
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:hidden">
            <MobileLinks />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pt-8">{children}</main>
      </div>
    </div>
  );
}
