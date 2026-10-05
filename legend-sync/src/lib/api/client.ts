const BASE = (process.env.CLASHKING_API_BASE ?? "https://api.clashk.ing").replace(/\/$/, "");

/** Absolute URL for a path on the stats API, for links such as file downloads. */
export const apiUrl = (path: string) => `${BASE}${path}`;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type QueryValue = string | number | boolean | null | undefined | ReadonlyArray<string | number>;

export type RequestOptions = {
  query?: Record<string, QueryValue>;
  /** Seconds to cache on the server. Use 0 to skip the cache. */
  revalidate?: number;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${BASE}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, String(item));
    } else {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function toApiError(res: Response): Promise<ApiError> {
  let message = res.statusText;
  let code: string | undefined;
  try {
    const body = (await res.json()) as { message?: string; code?: string; detail?: string };
    message = body.message ?? body.detail ?? message;
    code = body.code;
  } catch {
    // Body was not JSON, keep the status text.
  }
  return new ApiError(res.status, message, code);
}

export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, revalidate = 60, signal } = options;
  const res = await fetch(buildUrl(path, query), {
    headers: { Accept: "application/json" },
    signal,
    ...(revalidate === 0 ? { cache: "no-store" as const } : { next: { revalidate } }),
  });
  if (!res.ok) throw await toApiError(res);
  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(buildUrl(path, options.query), {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: options.signal,
  });
  if (!res.ok) throw await toApiError(res);
  return (await res.json()) as T;
}
