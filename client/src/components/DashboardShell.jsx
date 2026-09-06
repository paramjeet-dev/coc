import { Sword, ShieldCheck, TrendUp, ChartBar } from '@phosphor-icons/react/dist/ssr';
import TagSearch from './TagSearch';
import MetaDistribution from './MetaDistribution';
import LiveTicker from './LiveTicker';

/**
 * DashboardShell
 * Static server layout. All interactivity is delegated to isolated
 * client leaf components (TagSearch, MetaDistribution, LiveTicker).
 * Grid is intentionally asymmetric: no equal-width three-card row.
 */
export default function DashboardShell() {
  return (
    <div className="min-h-[100dvh] bg-zinc-950">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center border border-emerald-500/40 bg-emerald-500/10">
            <Sword size={16} strokeWidth={1.5} className="text-emerald-500" />
          </div>
          <span className="font-mono text-sm font-medium tracking-tight text-zinc-100">
            CoC Legend Sync
          </span>
          <span className="ml-2 border border-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">
            SEASON 42
          </span>
          <nav className="ml-auto hidden items-center gap-6 md:flex">
            <span className="text-sm text-zinc-500 hover:text-zinc-200">Dashboard</span>
            <span className="text-sm text-zinc-500 hover:text-zinc-200">War Log</span>
            <span className="text-sm text-zinc-500 hover:text-zinc-200">Meta</span>
            <span className="text-sm text-zinc-500 hover:text-zinc-200">Base Builder</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-zinc-100 md:text-4xl">
            Legend League command center
          </h1>
          <p className="mt-2 max-w-[60ch] text-sm text-zinc-500">
            Trophy movement, attack meta, and war performance in one instrument panel. Built for
            players who treat the ladder like a job.
          </p>
        </div>

        <div className="mb-6">
          <TagSearch />
        </div>

        {/* Asymmetric grid: wide meta panel + narrow stat column + full-width ticker */}
        <div className="grid grid-cols-1 gap-px bg-slate-800 lg:grid-cols-[2fr_1fr]">
          <section className="bg-zinc-950 p-6">
            <div className="mb-5 flex items-center gap-2">
              <ChartBar size={16} strokeWidth={1.5} className="text-emerald-500" />
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
                Attack meta distribution
              </h2>
            </div>
            <MetaDistribution />
          </section>

          <aside className="grid grid-cols-1 divide-y divide-slate-800 bg-zinc-950">
            <div className="p-6">
              <div className="mb-2 flex items-center gap-2 text-zinc-500">
                <TrendUp size={14} strokeWidth={1.5} />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                  Top trophy today
                </span>
              </div>
              <div className="font-mono text-3xl text-zinc-100">5,482</div>
              <div className="mt-1 font-mono text-xs text-emerald-500">+34 since reset</div>
            </div>
            <div className="p-6">
              <div className="mb-2 flex items-center gap-2 text-zinc-500">
                <ShieldCheck size={14} strokeWidth={1.5} />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                  War attacks tracked
                </span>
              </div>
              <div className="font-mono text-3xl text-zinc-100">128,904</div>
              <div className="mt-1 font-mono text-xs text-zinc-600">last 24 hours</div>
            </div>
          </aside>
        </div>

        <div className="mt-6">
          <LiveTicker />
        </div>
      </main>
    </div>
  );
}