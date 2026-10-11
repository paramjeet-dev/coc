import type { ReactNode } from "react";
import { cn } from "cn";

type PanelProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Panel({ title, description, eyebrow, action, className, children }: PanelProps) {
  return (
    <section className={cn("rounded-2xl bg-ink-900 p-5 ring-1 ring-ink-800 sm:p-6", className)}>
      {title && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && (
              <p className="mb-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-gold-400">{eyebrow}</p>
            )}
            <h2 className="text-base font-semibold tracking-tight text-ink-100">{title}</h2>
            {description && <p className="mt-1 max-w-prose text-sm text-ink-300">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
