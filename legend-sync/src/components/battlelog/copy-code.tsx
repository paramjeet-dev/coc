"use client";

import { useState } from "react";

/** Copies an army share code. The only stateful piece of the battle log. */
export function CopyCode({ code, label = "Copy code" }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className="rounded-md px-2 py-1 font-mono text-[11px] text-ink-300 outline-none ring-1 ring-ink-700 transition-colors hover:bg-ink-800 hover:text-ink-100 focus-visible:ring-2 focus-visible:ring-gold-400 motion-reduce:transition-none"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
