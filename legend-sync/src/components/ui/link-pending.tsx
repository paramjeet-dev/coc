"use client";

import { useLinkStatus } from "next/link";

/** Place inside a <Link>. Shows a tiny dot pulse while that link's navigation is in flight. */
export function LinkPending({ className = "" }: { className?: string }) {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`inline-flex w-0 items-center overflow-visible transition-opacity ${pending ? "opacity-100" : "opacity-0"} ${className}`}
    >
      <span className="ml-1.5 size-1.5 shrink-0 animate-ping rounded-full bg-gold-400 motion-reduce:animate-none" />
    </span>
  );
}
