import Link from "next/link";
import { ArrowUpRight, FlaskConical, ScrollText, Shield, Swords, Trophy, type LucideIcon } from "lucide-react";
import { LinkPending } from "@/components/ui/link-pending";

const FEATURES: ReadonlyArray<{ href: string; title: string; body: string; icon: LucideIcon }> = [
  {
    href: "/player",
    title: "Legends history",
    icon: Trophy,
    body: "Daily trophy swings, attack and defense results, and every past Legend season for a player.",
  },
  {
    href: "/player",
    title: "Ranked season insights",
    icon: Swords,
    body: "Your tournament group, placement, trophy percentiles and how your tier performed.",
  },
  {
    href: "/meta",
    title: "Meta armies",
    icon: FlaskConical,
    body: "Which army families top players run, with triple rates, average duration and daily trends.",
  },
  {
    href: "/clans",
    title: "Clan legend summaries",
    icon: Shield,
    body: "Season finishes, top players and how a clan's Legend roster has moved over time.",
  },
  {
    href: "/player",
    title: "Battle log",
    icon: ScrollText,
    body: "Stored attack history with stars, destruction and shareable army codes.",
  },
];

export function FeatureIndex() {
  return (
    <ul className="grid gap-2">
      {FEATURES.map((feature, index) => (
        <li key={feature.title}>
          <Link
            href={feature.href}
            className="group flex items-start gap-4 rounded-xl p-3 outline-none transition-colors hover:bg-ink-850 focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none"
          >
            <span
              aria-hidden
              className={`grid size-10 shrink-0 place-items-center rounded-xl ring-1 ${
                index === 0
                  ? "bg-gold-400 text-ink-950 ring-gold-400"
                  : "bg-ink-800 text-gold-300 ring-ink-700"
              }`}
            >
              <feature.icon className="size-[1.15rem]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center text-base font-semibold text-ink-100 group-hover:text-gold-300">
                {feature.title}
                <LinkPending />
              </span>
              <span className="mt-0.5 block text-sm text-ink-300">{feature.body}</span>
            </span>
            <ArrowUpRight aria-hidden className="mt-1 size-4 shrink-0 text-ink-700 transition-colors group-hover:text-gold-300" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
