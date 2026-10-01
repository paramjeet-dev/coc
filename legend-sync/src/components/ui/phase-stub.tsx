import type { ReactNode } from "react";

type Props = {
  title: string;
  summary: string;
  endpoints: string[];
  children?: ReactNode;
};

/** Placeholder for pages that land in a later phase. Lists the endpoints each page will use. */
export function PhaseStub({ title, summary, endpoints, children }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-prose text-ink-300">{summary}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
      <aside className="rounded-tile bg-ink-900 p-5 ring-1 ring-ink-800 lg:col-span-5">
        <h2 className="text-sm font-semibold text-ink-100">Data sources for this page</h2>
        <ul className="mt-3 space-y-2">
          {endpoints.map((endpoint) => (
            <li key={endpoint} className="font-mono text-xs text-tide-400">
              {endpoint}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
