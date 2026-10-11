import type { ReactNode } from "react";
import { cn } from "cn";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, actions, className }: Props) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0 max-w-2xl">
        {eyebrow && (
          <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gold-400">{eyebrow}</p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-ink-300">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}
