import Link from "next/link";
import type { BattleHistoryItem } from "@/lib/api/types";

const SLOTS = 8;

const PIP: Record<number, string> = {
  3: "bg-gold-400",
  2: "bg-tide-400",
  1: "bg-ember-400/80",
  0: "bg-ink-700",
};

type Props = {
  days: string[];
  attacksByDay: Map<string, BattleHistoryItem[]>;
  selectedDay: string | undefined;
  basePath: string;
};

/**
 * The attack strip: one column per Legend day, one pip per attack, colored by stars.
 * Reading across shows form. Reading down shows how a day unfolded.
 */
export function AttackStrip({ days, attacksByDay, selectedDay, basePath }: Props) {
  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <ol className="flex min-w-max gap-1.5">
          {days.map((day) => {
            const attacks = attacksByDay.get(day) ?? [];
            const selected = day === selectedDay;
            const label = `${day}: ${attacks.length} attacks, ${attacks.filter((a) => a.stars === 3).length} triples`;
            return (
              <li key={day}>
                <Link
                  href={`${basePath}?day=${day}`}
                  scroll={false}
                  aria-label={label}
                  aria-current={selected ? "date" : undefined}
                  className={`flex flex-col items-center gap-1.5 rounded-lg px-1.5 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none ${
                    selected ? "bg-ink-800 ring-1 ring-gold-600" : "hover:bg-ink-800/70"
                  }`}
                >
                  <span className="flex flex-col-reverse gap-1">
                    {Array.from({ length: SLOTS }, (_, i) => {
                      const attack = attacks[i];
                      return (
                        <span
                          key={i}
                          aria-hidden
                          className={`size-3 rounded-full ${
                            attack ? (PIP[attack.stars] ?? PIP[0]) : "ring-1 ring-ink-800"
                          }`}
                        />
                      );
                    })}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-ink-300">
                    {Number(day.slice(8, 10))}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-300">
        {[
          ["Triple", "bg-gold-400"],
          ["Two stars", "bg-tide-400"],
          ["One star", "bg-ember-400/80"],
          ["No stars", "bg-ink-700"],
        ].map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5">
            <dt className="sr-only">{name}</dt>
            <dd className="flex items-center gap-1.5">
              <span aria-hidden className={`size-2.5 rounded-full ${color}`} />
              {name}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
