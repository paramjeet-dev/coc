import "server-only";
import { Client } from "clashofclans.js";

/**
 * Official Clash of Clans API client with automatic IP handling.
 *
 * The official API only accepts requests from IPs listed on a key. clashofclans.js solves this
 * for dynamic IPs by logging in to developer.clashofclans.com with an account:
 *   1. it reads the IP the developer site sees for this machine,
 *   2. it revokes keys with our key name that are bound to some other IP,
 *   3. it reuses a key bound to the current IP, or creates one,
 *   4. when a request later fails with accessDenied.invalidIp it logs in again and retries.
 * Step 4 only runs when retryLimit is above zero, so retryLimit must not be left at its default of 0.
 */

const LOGIN_RETRY_COOLDOWN_MS = 30_000;

type State = {
  client: Client;
  ready: Promise<void> | null;
  failedAt: number;
};

const globalState = globalThis as typeof globalThis & { __cocOfficial?: State };

export const isOfficialConfigured = () => Boolean(process.env.COC_EMAIL && process.env.COC_PASSWORD);

function state(): State {
  if (!globalState.__cocOfficial) {
    globalState.__cocOfficial = {
      client: new Client({
        retryLimit: 2,
        cache: true,
        restRequestTimeout: 10_000,
      }),
      ready: null,
      failedAt: 0,
    };
  }
  return globalState.__cocOfficial;
}

/** Logs in once per process. A failed login is not retried for 30 seconds, so a bad password cannot hammer the developer site. */
export async function getOfficialClient(): Promise<Client> {
  const s = state();
  if (!isOfficialConfigured()) throw new Error("Official API credentials are not configured.");

  if (!s.ready) {
    if (Date.now() - s.failedAt < LOGIN_RETRY_COOLDOWN_MS) {
      throw new Error("Official API login failed recently. Retrying shortly.");
    }
    s.ready = s.client
      .login({
        email: process.env.COC_EMAIL!,
        password: process.env.COC_PASSWORD!,
        keyName: process.env.COC_KEY_NAME ?? "legend-sync",
        keyCount: Number(process.env.COC_KEY_COUNT ?? 1),
        keyDescription: "Legend Sync server key, managed automatically",
      })
      .then(() => undefined)
      .catch((error: unknown) => {
        s.ready = null;
        s.failedAt = Date.now();
        throw error;
      });
  }
  await s.ready;
  return s.client;
}

type Cached<T> = { value: T; expires: number };
const store = (globalState as typeof globalThis & { __cocMemo?: Map<string, Cached<unknown>> });
store.__cocMemo ??= new Map();
const inflight = new Map<string, Promise<unknown>>();

/** Small in-memory TTL cache with in-flight de-duplication, so a burst of page views makes one upstream call. */
export async function memo<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = store.__cocMemo!.get(key) as Cached<T> | undefined;
  if (hit && hit.expires > Date.now()) return hit.value;
  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) return pending;
  const promise = load()
    .then((value) => {
      store.__cocMemo!.set(key, { value, expires: Date.now() + ttlMs });
      return value;
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, promise);
  return promise;
}
