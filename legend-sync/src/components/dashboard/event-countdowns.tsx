"use client";

import { useEffect, useState } from "react";
import {
  clanGamesClock,
  legendDayClock,
  raidWeekendClock,
  remaining,
  seasonClock,
  type EventClock,
} from "@/lib/events";

const pad = (n: number) => String(n).padStart(2, "0");

function Clock({ clock, now }: { clock: EventClock | null; now: Date | null }) {
  if (!clock || !now) {
    return <span className="font-mono text-base tabular-nums text-ink-500">--:--:--</span>;
  }
  const r = remaining(clock.target, now);
  return (
    <span role="timer" className="font-mono text-base tabular-nums text-ink-100">
      {r.days > 0 && (
        <>
          {r.days}
          <span className="text-ink-500">d </span>
        </>
      )}
      {pad(r.hours)}
      <span className="text-ink-500">:</span>
      {pad(r.minutes)}
      <span className="text-ink-500">:</span>
      {pad(r.seconds)}
    </span>
  );
}

/** Ticks once a second. The first render is a placeholder so server and client markup match. */
export function EventCountdowns({ seasonEnd }: { seasonEnd: string | null }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const current = now ?? new Date(0);
  const rows: Array<{ label: string; clock: EventClock | null }> = [
    { label: "Legend day", clock: now ? legendDayClock(current) : null },
    { label: "Season", clock: now ? seasonClock(seasonEnd, current) : null },
    { label: "Raid weekend", clock: now ? raidWeekendClock(current) : null },
    { label: "Clan Games", clock: now ? clanGamesClock(current) : null },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="flex items-center gap-2 text-sm text-ink-300">
            {row.label}
            {row.clock && (
              <span
                className={`rounded px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide ${
                  row.clock.phase === "live" ? "bg-tide-400/15 text-tide-400" : "bg-ink-700 text-ink-300"
                }`}
              >
                {row.clock.phase === "live" ? "ends in" : "starts in"}
              </span>
            )}
          </dt>
          <dd className="mt-1">
            <Clock clock={row.clock} now={now} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
