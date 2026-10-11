"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { looksLikeTag, tagToSlug } from "@/lib/api/tags";
import { Search } from "lucide-react";
import type { Num } from "@/lib/api/types";
import { Spinner } from "@/components/ui/spinner";
import { RESULT_LIST, SearchStatus } from "./search-parts";

type Hit = {
  name: string;
  tag: string;
  townHallLevel: Num;
  clan?: { name?: string };
};

type Props = {
  size?: "bar" | "md" | "lg";
  placeholder?: string;
};

export function PlayerSearch({ size = "md", placeholder = "Player name or tag" }: Props) {
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
        const res = await fetch(`/api/search?kind=player&q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
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
    if (looksLikeTag(value)) router.push(`/player/${tagToSlug(value)}/legends`);
    else if (hits[0]) router.push(`/player/${tagToSlug(hits[0].tag)}/legends`);
  }

  const large = size === "lg";
  const bar = size === "bar";
  const submitLabel = "Find player";

  return (
    <div className="relative w-full">
      <form onSubmit={submit} role="search" className="flex items-center gap-2">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search players
        </label>
        <div className="relative w-full">
          {(bar || large) && (
            <Search
              aria-hidden
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink-500 ${
                large ? "left-5 size-5" : "left-3.5 size-4"
              }`}
            />
          )}
          <input
            id={`${listId}-input`}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            aria-controls={listId}
            className={`w-full border border-ink-700 bg-ink-900 text-ink-100 placeholder:text-ink-500 outline-none transition-colors focus-visible:border-gold-400 focus-visible:ring-2 focus-visible:ring-gold-400/30 motion-reduce:transition-none ${
              large ? "h-14 rounded-2xl pl-13 pr-5 text-lg" : bar ? "h-10 rounded-xl pl-10 pr-3 text-sm" : "h-10 rounded-xl px-4 text-sm"
            }`}
          />
          {status === "loading" && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <Spinner size="sm" label="Searching players" />
            </span>
          )}
        </div>
        <button
          type="submit"
          className={`shrink-0 rounded-xl bg-gold-400 font-semibold text-ink-950 outline-none transition-colors hover:bg-gold-300 focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 motion-reduce:transition-none ${
            large ? "h-14 rounded-2xl px-7 text-base" : bar ? "sr-only" : "h-10 px-5 text-sm"
          }`}
        >
          {submitLabel}
        </button>
      </form>

      <div id={listId} aria-live="polite">
        <SearchStatus status={status} noun="player" floating={bar || large} />
        {hits.length > 0 && (
          <ul className={RESULT_LIST}>
            {hits.map((hit) => (
              <li key={hit.tag}>
                <Link
                  href={`/player/${tagToSlug(hit.tag)}/legends`}
                  className="flex items-center justify-between gap-4 px-4 py-2.5 outline-none hover:bg-ink-800 focus-visible:bg-ink-800"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{hit.name}</span>
                    <span className="block truncate text-xs text-ink-500">
                      {hit.clan?.name ?? "No clan"}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-ink-300">
                    {hit.tag}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
