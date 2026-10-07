"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { looksLikeTag, tagToSlug } from "@/lib/api/tags";
import type { Num } from "@/lib/api/types";

type Hit = {
  name: string;
  tag: string;
  townHallLevel: Num;
  clan?: { name?: string };
};

type Props = {
  size?: "md" | "lg";
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

  return (
    <div className="relative w-full">
      <form onSubmit={submit} role="search" className="flex items-center gap-2">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search players
        </label>
        <input
          id={`${listId}-input`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-controls={listId}
          className={`w-full rounded-full border border-ink-700 bg-ink-900 text-ink-100 placeholder:text-ink-500 outline-none transition-colors focus-visible:border-gold-400 focus-visible:ring-2 focus-visible:ring-gold-400/40 motion-reduce:transition-none ${
            large ? "h-14 px-6 text-lg" : "h-10 px-4 text-sm"
          }`}
        />
        <button
          type="submit"
          className={`shrink-0 rounded-full bg-gold-400 font-semibold text-ink-950 outline-none transition-colors hover:bg-gold-300 focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 motion-reduce:transition-none ${
            large ? "h-14 px-7 text-base" : "h-10 px-5 text-sm"
          }`}
        >
          Find player
        </button>
      </form>

      <div id={listId} aria-live="polite" className="mt-2">
        {status === "loading" && <p className="px-2 text-sm text-ink-500">Searching players</p>}
        {status === "empty" && (
          <p className="px-2 text-sm text-ink-500">
            No players match that name. Try the player tag, for example #2PP.
          </p>
        )}
        {status === "error" && (
          <p className="px-2 text-sm text-ember-400">
            Search is unavailable right now. Paste a player tag to open a profile directly.
          </p>
        )}
        {hits.length > 0 && (
          <ul className="absolute left-0 right-0 z-20 overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl shadow-black/40">
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
