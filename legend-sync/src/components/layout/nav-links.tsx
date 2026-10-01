"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/player", label: "Players" },
  { href: "/meta", label: "Meta armies" },
  { href: "/clans", label: "Clans" },
  { href: "/war", label: "War" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex items-center gap-1">
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none ${
              active
                ? "bg-ink-800 text-gold-300"
                : "text-ink-300 hover:bg-ink-900 hover:text-ink-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
