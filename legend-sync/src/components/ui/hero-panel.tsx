import type { ReactNode } from "react";
import { cn } from "cn";

/** The lead card of a page: a soft gold glow in the corner and a stronger edge. */
export function HeroPanel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl bg-ink-900 p-6 ring-1 ring-gold-400/20 sm:p-8",
        "bg-[radial-gradient(ellipse_60%_80%_at_100%_0%,oklch(0.82_0.15_85/0.12),transparent_70%)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
