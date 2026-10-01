import Link from "next/link";
import { NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-800 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          <span aria-hidden className="size-3 rotate-45 rounded-[3px] bg-gold-400" />
          <span className="text-base font-semibold tracking-tight">Legend Sync</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
