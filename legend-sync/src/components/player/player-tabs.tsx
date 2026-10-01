"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PlayerTabs({ slug }: { slug: string }) {
  const pathname = usePathname();
  const tabs = [
    { href: `/player/${slug}/legends`, label: "Legends" },
    { href: `/player/${slug}/ranked`, label: "Ranked seasons" },
    { href: `/player/${slug}/battlelog`, label: "Battle log" },
  ];

  return (
    <nav aria-label="Player sections" className="flex gap-6 border-b border-ink-800">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 py-3 text-sm font-medium outline-none transition-colors focus-visible:text-gold-300 motion-reduce:transition-none ${
              active
                ? "border-gold-400 text-gold-300"
                : "border-transparent text-ink-300 hover:text-ink-100"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
