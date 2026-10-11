import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "cn";

type Props = {
  title: ReactNode;
  children?: ReactNode;
  icon?: LucideIcon;
  tone?: "neutral" | "error";
  className?: string;
};

/** Shared card for "nothing stored" and "could not load" messages. */
export function EmptyState({ title, children, icon: Icon = Inbox, tone = "neutral", className }: Props) {
  return (
    <section className={cn("flex items-start gap-4 rounded-2xl bg-ink-900 p-6 ring-1 ring-ink-800 sm:p-8", className)}>
      <span
        aria-hidden
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-xl ring-1",
          tone === "error" ? "bg-ember-400/10 text-ember-400 ring-ember-400/25" : "bg-ink-800 text-ink-300 ring-ink-700",
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {children && <div className="mt-1.5 max-w-prose text-sm text-ink-300">{children}</div>}
      </div>
    </section>
  );
}
