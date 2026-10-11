"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkPending } from "@/components/ui/link-pending";

export function PlayerTabs({ slug }: { slug: string }) {
  const pathname = usePathname();
  const tabs = [
    { href: `/player/${slug}/legends`, label: "Legends" },
    { href: `/player/${slug}/ranked`, label: "Ranked seasons" },
    { href: `/player/${slug}/battlelog`, label: "Battle log" },
  ];

  return (
    <nav
      aria-label="Player sections"
      className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-ink-900 p-1 ring-1 ring-ink-800"
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center rounded-lg px-4 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none ${
              active ? "bg-gold-400 text-ink-950" : "text-ink-300 hover:bg-ink-850 hover:text-ink-100"
            }`}
          >
            {tab.label}
            <LinkPending />
          </Link>
        );
      })}
    </nav>
  );
}
