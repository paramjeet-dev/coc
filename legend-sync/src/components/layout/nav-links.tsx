"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, LayoutDashboard, Shield, Swords, Trophy, type LucideIcon } from "lucide-react";
import { LinkPending } from "@/components/ui/link-pending";

type Item = { href: string; label: string; hint: string; icon: LucideIcon };

const LINKS: Item[] = [
  { href: "/", label: "Overview", hint: "Live Legend pulse", icon: LayoutDashboard },
  { href: "/player", label: "Players", hint: "Legends, ranked, battle log", icon: Trophy },
  { href: "/meta", label: "Meta armies", hint: "What top players run", icon: FlaskConical },
  { href: "/clans", label: "Clans", hint: "Legend roster history", icon: Shield },
  { href: "/war", label: "War", hint: "Wars and CWL analytics", icon: Swords },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Vertical list for the desktop sidebar. */
export function SidebarLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="flex flex-col gap-1">
      {LINKS.map(({ href, label, hint, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none ${
              active ? "bg-gold-400 text-ink-950" : "text-ink-300 hover:bg-ink-850 hover:text-ink-100"
            }`}
          >
            <Icon aria-hidden className={`size-[1.15rem] shrink-0 ${active ? "text-ink-950" : "text-ink-500 group-hover:text-gold-300"}`} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold leading-tight">{label}</span>
              <span className={`block truncate text-xs ${active ? "text-ink-950/70" : "text-ink-500"}`}>{hint}</span>
            </span>
            <LinkPending />
          </Link>
        );
      })}
    </nav>
  );
}

/** Horizontal scroller for narrow screens. */
export function MobileLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
              active ? "bg-gold-400 text-ink-950" : "bg-ink-850 text-ink-300"
            }`}
          >
            <Icon aria-hidden className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
