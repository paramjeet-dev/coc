import "server-only";
import { getLeagueHistory } from "./api/endpoints";
import type { RankedSeasonRecord } from "./api/types";
import { isOfficialConfigured } from "./coc/client";
import { getOfficialRankedSeasons } from "./coc/ranked";
import { rankedSeasons } from "./ranked";

export type RankedSourceName = "clashking" | "official";

export type RankedHistory =
  | { ok: true; source: RankedSourceName; seasons: RankedSeasonRecord[] }
  | { ok: false; seasons: [] };

/**
 * RANKED_SOURCE=auto (default): ClashKing first, official API when ClashKing has nothing or fails.
 * RANKED_SOURCE=official: official API only.
 * RANKED_SOURCE=clashking: ClashKing only.
 */
const mode = () => (process.env.RANKED_SOURCE ?? "auto").toLowerCase();

export async function loadRankedHistory(tag: string): Promise<RankedHistory> {
  const m = mode();
  const canUseOfficial = m !== "clashking" && isOfficialConfigured();

  if (m !== "official") {
    const fromClashKing = await getLeagueHistory(tag).then(
      (r) => rankedSeasons(r.items),
      () => null,
    );
    if (fromClashKing && fromClashKing.length > 0) return { ok: true, source: "clashking", seasons: fromClashKing };
    if (!canUseOfficial) {
      return fromClashKing ? { ok: true, source: "clashking", seasons: [] } : { ok: false, seasons: [] };
    }
  }

  if (!canUseOfficial) return { ok: false, seasons: [] };
  return getOfficialRankedSeasons(tag).then(
    (seasons) => ({ ok: true as const, source: "official" as const, seasons: rankedSeasons(seasons) }),
    () => ({ ok: false as const, seasons: [] as [] }),
  );
}
