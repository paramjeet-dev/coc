import type { ReactNode } from "react";

type PanelProps = {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function Panel({ title, description, className = "", children }: PanelProps) {
  return (
    <section className={`bg-ink-900 ring-1 ring-ink-800 ${className}`}>
      {title && (
        <header className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description && <p className="mt-1 max-w-prose text-sm text-ink-300">{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
