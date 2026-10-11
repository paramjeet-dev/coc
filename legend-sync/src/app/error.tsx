"use client";

import Link from "next/link";
import { useTransition } from "react";
import { CircleAlert, RefreshCw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

function referenceCode(digest: string | undefined): string {
  const raw = (digest ?? "").replace(/[^a-z0-9]/gi, "").toUpperCase();
  if (raw.length < 4) return "UNKNOWN";
  return `${raw.slice(0, 4)}-${raw.slice(4, 9).padEnd(5, "0")}`;
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center pt-16 text-center sm:pt-24">
      <span
        aria-hidden
        className="grid size-20 place-items-center rounded-2xl bg-ink-900 text-ink-300 ring-1 ring-ink-700"
      >
        <CircleAlert className="size-8" />
      </span>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">Something went wrong</h1>
      <p className="mt-3 text-ink-300">
        An unexpected error occurred while loading this page. The ClashKing API may be slow or
        unreachable. Please try again.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => reset())}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-ink-100 px-4 text-sm font-semibold text-ink-950 outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-gold-400 disabled:opacity-70"
        >
          {pending ? <Spinner size="sm" label="Retrying" className="[&_span]:bg-ink-950" /> : <RefreshCw aria-hidden className="size-4" />}
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold text-ink-100 outline-none ring-1 ring-ink-700 transition-colors hover:bg-ink-900 focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          Back to overview
        </Link>
      </div>
      <p className="mt-8 font-mono text-xs text-ink-500">Reference: {referenceCode(error.digest)}</p>
    </div>
  );
}
