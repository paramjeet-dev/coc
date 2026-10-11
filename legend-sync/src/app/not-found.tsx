import Link from "next/link";

function Ghost() {
  return (
    <svg
      viewBox="0 0 120 150"
      aria-hidden
      className="h-28 w-24 shrink-0 motion-safe:animate-float sm:h-36 sm:w-28"
    >
      <path
        d="M60 8C34 8 16 28 16 54v78c0 6 6 9 11 5l9-8 10 9c3 3 8 3 11 0l3-3 3 3c3 3 8 3 11 0l10-9 9 8c5 4 11 1 11-5V54C104 28 86 8 60 8Z"
        className="fill-ink-100"
      />
      <path
        d="M16 86c-8 2-12 10-10 18 1 4 6 4 8 1M104 86c8 2 12 10 10 18-1 4-6 4-8 1"
        className="fill-none stroke-ink-100"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <ellipse cx="46" cy="58" rx="6" ry="9" className="fill-ink-950" />
      <ellipse cx="76" cy="58" rx="6" ry="9" className="fill-ink-950" />
      <ellipse cx="61" cy="80" rx="5" ry="6" className="fill-ink-950" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center pt-12 text-center sm:pt-20">
      <div className="flex items-center gap-4 font-mono text-8xl font-bold leading-none text-ink-700 sm:gap-6 sm:text-9xl">
        <span aria-hidden>4</span>
        <Ghost />
        <span aria-hidden>4</span>
      </div>
      <h1 className="mt-10 text-3xl font-semibold tracking-tight sm:text-4xl">
        Boo! <span className="text-gold-300">Page missing!</span>
      </h1>
      <p className="mt-3 text-ink-300">
        Whoops! This page must be a ghost, it is not here. Check the address or search for a player
        from the overview.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-xl bg-gold-400 px-5 text-sm font-semibold text-ink-950 outline-none transition-colors hover:bg-gold-300 focus-visible:ring-2 focus-visible:ring-gold-300"
        >
          Back to overview
        </Link>
        <Link
          href="/meta"
          className="inline-flex h-10 items-center rounded-xl px-5 text-sm font-semibold text-ink-100 outline-none ring-1 ring-ink-700 transition-colors hover:bg-ink-900 focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          Browse meta armies
        </Link>
      </div>
    </div>
  );
}
