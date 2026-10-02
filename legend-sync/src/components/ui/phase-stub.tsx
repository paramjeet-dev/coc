import type { ReactNode } from "react";

type Props = {
  title: string;
  summary: string;
  children?: ReactNode;
};

/** Placeholder for pages that land in a later phase. */
export function PhaseStub({ title, summary, children }: Props) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-ink-300">{summary}</p>
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
