const BASE_URL = 'https://api.clashk.ing/v2';

/**
 * ck (ClashKing fetch helper)
 * Every function here hits a real, documented ClashKing v2 route.
 * No mock data lives in this file or anywhere downstream of it.
 * Public GET routes on ClashKing do not require auth (per their API docs).
 */
async function ckFetch(path, { signal } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message || `ClashKing request failed (${res.status})`;
    throw new Error(message);
  }
  return res.json();
}

/** GET /v2/counts -> modelsv2.GlobalCountsResponse */
export function getGlobalCounts(opts) {
  return ckFetch('/counts', opts);
}

/**
 * GET /v2/player/search?query=...
 * -> modelsv2.SearchPlayerResponse { items: SearchPlayerResult[], pagination }
 */
export function searchPlayers(query, opts) {
  const params = new URLSearchParams({ query, limit: '10' });
  return ckFetch(`/player/search?${params}`, opts);
}

/**
 * GET /v2/leaderboard/townhalls/{townhall_level}
 * -> modelsv2.PlayerLeaderboardResponse
 * Used to drive the "meta distribution" panel indirectly is not appropriate
 * (that needs army-composition stats), so this powers the trophy leaderboard rail.
 */
export function getTownhallLeaderboard(townhallLevel, limit = 8, opts) {
  const params = new URLSearchParams({ limit: String(limit) });
  return ckFetch(`/leaderboard/townhalls/${townhallLevel}?${params}`, opts);
}

/**
 * QUERY /v2/stats/armies (RFC QUERY method with JSON body)
 * -> modelsv2.StatsArmiesResponse { items: StatsArmyItem[] }
 * This is the real source for "attack meta distribution" (usage_rate per army).
 */
export async function getArmyMeta(body, opts) {
  const res = await fetch(`${BASE_URL}/stats/armies`, {
    method: 'QUERY',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: opts?.signal,
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new Error(errBody?.message || `ClashKing request failed (${res.status})`);
  }
  return res.json();
}

/**
 * GET /v2/clan/{clan_tag}/join-leave
 * -> modelsv2.JoinLeaveResponse { items: JoinLeaveEvent[] }
 * Used as the real "live feed" once a clan tag is known.
 */
export function getClanJoinLeave(clanTag, limit = 10, opts) {
  const params = new URLSearchParams({ limit: String(limit) });
  return ckFetch(`/clan/${encodeURIComponent(clanTag)}/join-leave?${params}`, opts);
}

/**
 * GET /v2/clan/{clan_tag}/wars
 * -> modelsv2.WarListResponse { items: WarResponse[] }
 */
export function getClanWars(clanTag, limit = 5, opts) {
  const params = new URLSearchParams({ limit: String(limit) });
  return ckFetch(`/clan/${encodeURIComponent(clanTag)}/wars?${params}`, opts);
}

/** GET /v2/dates/current -> modelsv2.CurrentDatesResponse */
export function getCurrentDates(opts) {
  return ckFetch('/dates/current', opts);
}