export type EventPhase = "live" | "upcoming";
export type EventClock = { phase: EventPhase; target: Date };

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** A Legend day rolls over at 05:00 UTC. Always a live countdown to the next rollover. */
export function legendDayClock(now: Date): EventClock {
  const t = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 5);
  return { phase: "live", target: new Date(t > now.getTime() ? t : t + DAY) };
}

/** Raid weekend runs Friday 07:00 UTC to Monday 07:00 UTC. */
export function raidWeekendClock(now: Date): EventClock {
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const sinceFriday = (now.getUTCDay() - 5 + 7) % 7;
  let start = midnight - sinceFriday * DAY + 7 * HOUR;
  if (start > now.getTime()) start -= 7 * DAY;
  const end = start + 3 * DAY;
  if (now.getTime() < end) return { phase: "live", target: new Date(end) };
  return { phase: "upcoming", target: new Date(start + 7 * DAY) };
}

/** Clan Games run from the 22nd at 08:00 UTC to the 28th at 08:00 UTC each month. */
export function clanGamesClock(now: Date): EventClock {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const start = Date.UTC(y, m, 22, 8);
  const end = Date.UTC(y, m, 28, 8);
  const t = now.getTime();
  if (t < start) return { phase: "upcoming", target: new Date(start) };
  if (t < end) return { phase: "live", target: new Date(end) };
  return { phase: "upcoming", target: new Date(Date.UTC(y, m + 1, 22, 8)) };
}

export function seasonClock(seasonEnd: string | null, now: Date): EventClock | null {
  if (!seasonEnd) return null;
  const target = new Date(seasonEnd);
  if (Number.isNaN(target.getTime())) return null;
  return target.getTime() > now.getTime() ? { phase: "live", target } : null;
}

export type Remaining = { days: number; hours: number; minutes: number; seconds: number };

export function remaining(target: Date, now: Date): Remaining {
  const total = Math.max(Math.floor((target.getTime() - now.getTime()) / 1000), 0);
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  };
}
