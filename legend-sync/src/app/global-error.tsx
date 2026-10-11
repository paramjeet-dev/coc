"use client";

import "./globals.css";

/** Last-resort boundary for errors thrown in the root layout itself. */
export default function RootError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-ink-950 px-6 font-sans text-ink-100 antialiased">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="mt-3 text-ink-300">Legend Sync hit an unexpected error. Please try again.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 h-10 rounded-xl bg-gold-400 px-5 text-sm font-semibold text-ink-950 outline-none hover:bg-gold-300 focus-visible:ring-2 focus-visible:ring-gold-300"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
