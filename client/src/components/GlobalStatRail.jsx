'use client';

import { motion } from 'motion/react';
import { TrendUp, ShieldCheck, WarningCircle, UsersThree } from '@phosphor-icons/react';
import { getGlobalCounts } from '../lib/clashking';
import { usePolledFetch } from '../lib/usePolledFetch';

function StatBlock({ icon, label, value, sub, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="p-6"
    >
      <div className="mb-2 flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="font-mono text-[11px] uppercase tracking-[0.18em]">{label}</span>
      </div>
      <div className="font-mono text-3xl text-zinc-100">{value}</div>
      {sub && <div className="mt-1 font-mono text-xs text-zinc-600">{sub}</div>}
    </motion.div>
  );
}

/**
 * GlobalStatRail
 * Real numbers from GET /v2/counts (modelsv2.GlobalCountsResponse).
 * Polled every 30s so the "live" feel is honest, not simulated.
 */
export default function GlobalStatRail() {
  const { data, error, loading } = usePolledFetch(
    ({ signal }) => getGlobalCounts({ signal }),
    [],
    30000
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 divide-y divide-slate-800">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="animate-pulse p-6">
            <div className="mb-3 h-3 w-32 bg-zinc-900" />
            <div className="h-8 w-24 bg-zinc-900" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-6 text-zinc-500">
        <WarningCircle size={16} strokeWidth={1.5} className="text-emerald-600" />
        <span className="text-sm">Global counts unavailable right now.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 divide-y divide-slate-800">
      <StatBlock
        icon={<UsersThree size={14} strokeWidth={1.5} />}
        label="Players tracked"
        value={(data.player_count ?? 0).toLocaleString()}
        sub={`${(data.players_in_legends ?? 0).toLocaleString()} in Legend League`}
        delay={0}
      />
      <StatBlock
        icon={<ShieldCheck size={14} strokeWidth={1.5} />}
        label="Clans tracked"
        value={(data.clan_count ?? 0).toLocaleString()}
        sub={`${(data.clans_in_war ?? 0).toLocaleString()} currently at war`}
        delay={0.06}
      />
      <StatBlock
        icon={<TrendUp size={14} strokeWidth={1.5} />}
        label="Wars stored"
        value={(data.wars_stored ?? 0).toLocaleString()}
        sub={`${(data.players_in_war ?? 0).toLocaleString()} players in active wars`}
        delay={0.12}
      />
    </div>
  );
}