"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { looksLikeTag, tagToSlug } from "@/lib/api/tags";
import { Search } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { Num } from "@/lib/api/types";
import { RESULT_LIST, SearchStatus } from "./search-parts";

type Hit = { name: string; tag: string; clanLevel: Num; members: Num };

export function ClanSearch({
  placeholder = "Clan name or tag",
  basePath = "/clans",
}: {
  placeholder?: string;
  basePath?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const [value, setValue] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "empty" | "error">("idle");

  useEffect(() => {
    const query = value.trim();
    if (query.length < 3 || looksLikeTag(query)) {
      setHits([]);
      setStatus("idle");
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?kind=clan&q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!res.ok) throw new Error(String(res.status));
        const body = (await res.json()) as { items: Hit[] };
        setHits(body.items);
        setStatus(body.items.length === 0 ? "empty" : "idle");
      } catch (error) {
        if ((error as Error).name !== "AbortError") setStatus("error");
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (looksLikeTag(value)) router.push(`${basePath}/${tagToSlug(value)}`);
    else if (hits[0]) router.push(`${basePath}/${tagToSlug(hits[0].tag)}`);
  }

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={submit} role="search" className="flex items-center gap-2">
        <label htmlFor={`${listId}-input`} className="sr-only">Search clans</label>
        <div className="relative w-full">
          <Search aria-hidden className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-ink-500" />
          <input
            id={`${listId}-input`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            aria-controls={listId}
            className="h-14 w-full rounded-2xl border border-ink-700 bg-ink-900 pl-13 pr-5 text-lg text-ink-100 placeholder:text-ink-500 outline-none transition-colors focus-visible:border-gold-400 focus-visible:ring-2 focus-visible:ring-gold-400/30 motion-reduce:transition-none"
          />
          {status === "loading" && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <Spinner size="sm" label="Searching clans" />
            </span>
          )}
        </div>
        <button
          type="submit"
          className="h-14 shrink-0 rounded-2xl bg-gold-400 px-7 text-base font-semibold text-ink-950 outline-none transition-colors hover:bg-gold-300 focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 motion-reduce:transition-none"
        >
          Find clan
        </button>
      </form>
      <div id={listId} aria-live="polite">
        <SearchStatus status={status} noun="clan" floating />
        {hits.length > 0 && (
          <ul className={RESULT_LIST}>
            {hits.map((hit) => (
              <li key={hit.tag}>
                <Link
                  href={`${basePath}/${tagToSlug(hit.tag)}`}
                  className="flex items-center justify-between gap-4 px-4 py-2.5 outline-none hover:bg-ink-800 focus-visible:bg-ink-800"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{hit.name}</span>
                    <span className="block truncate text-xs text-ink-500">Level {String(hit.clanLevel)}, {String(hit.members)}/50 members</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-ink-300">{hit.tag}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
