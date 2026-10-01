"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg pt-20">
      <h1 className="text-2xl font-semibold tracking-tight">This page could not load</h1>
      <p className="mt-3 text-ink-300">
        The ClashKing API did not answer in time. Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-gold-400 px-5 py-2 text-sm font-semibold text-ink-950 outline-none hover:bg-gold-300 focus-visible:ring-2 focus-visible:ring-gold-300"
      >
        Try again
      </button>
    </div>
  );
}
