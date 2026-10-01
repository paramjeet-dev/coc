import Link from "next/link";

const FEATURES = [
  {
    href: "/player",
    title: "Legends history",
    body: "Daily trophy swings, attack and defense results, and every past Legend season for a player.",
  },
  {
    href: "/player",
    title: "Ranked season insights",
    body: "Your tournament group, placement, trophy percentiles and how your tier performed.",
  },
  {
    href: "/meta",
    title: "Meta armies",
    body: "Which army families top players run, with triple rates, average duration and daily trends.",
  },
  {
    href: "/clans",
    title: "Clan legend summaries",
    body: "Season finishes, top players and how a clan's Legend roster has moved over time.",
  },
  {
    href: "/player",
    title: "Battle log",
    body: "Stored attack history with stars, destruction and shareable army codes.",
  },
] as const;

export function FeatureIndex() {
  return (
    <ul className="divide-y divide-ink-800">
      {FEATURES.map((feature, index) => (
        <li key={feature.title}>
          <Link
            href={feature.href}
            className="group grid gap-1 py-4 outline-none focus-visible:bg-ink-800/60 sm:grid-cols-[14rem_1fr] sm:gap-6"
          >
            <span
              className={`text-base font-semibold group-hover:text-gold-300 ${
                index === 0 ? "text-gold-300" : "text-ink-100"
              }`}
            >
              {feature.title}
            </span>
            <span className="text-sm text-ink-300">{feature.body}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
