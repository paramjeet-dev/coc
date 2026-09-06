'use client';

import { motion, AnimatePresence } from 'motion/react';
import { WarningCircle, ChartBar } from '@phosphor-icons/react';
import { getArmyMeta } from '../lib/clashking';
import { usePolledFetch } from '../lib/usePolledFetch';

/**
 * MetaDistribution
 * Pulls real usage_rate figures from POST(QUERY) /v2/stats/armies.
 * Bars animate in on data change; no hardcoded army list anywhere.
 */
export default function MetaDistribution() {
  const { data, error, loading } = usePolledFetch(
    ({ signal }) =>
      getArmyMeta(
        {
          sort_by: 'usage_rate',
          limit: 6,
          minimum_sample_size: 50,
        },
        { signal }
      ),
    [],
    60000 // meta shifts slowly, refresh every 60s
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="mb-1 h-3 w-40 bg-zinc-900" />
            <div className="h-1.5 w-full bg-zinc-900" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 border border-slate-800 bg-zinc-900/40 px-4 py-3 text-zinc-500">
        <WarningCircle size={16} strokeWidth={1.5} className="text-emerald-600" />
        <span className="text-sm">Army meta feed unavailable right now.</span>
      </div>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="flex items-center gap-2 border border-slate-800 px-4 py-3 text-zinc-600">
        <ChartBar size={16} strokeWidth={1.5} />
        <span className="text-sm">No army samples meet the minimum size yet.</span>
      </div>
    );
  }

  const maxUsage = Math.max(...items.map((i) => i.usage_rate ?? 0), 0.0001);

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => (
          <motion.div
            key={item.army_share_code ?? i}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 22, delay: i * 0.03 }}
          >
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="truncate text-sm text-zinc-300">
                {(item.army_items ?? []).slice(0, 3).join(' + ') || 'Unnamed composition'}
              </span>
              <span className="shrink-0 font-mono text-xs text-zinc-500">
                {(item.usage_rate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.usage_rate / maxUsage) * 100}%` }}
                transition={{ type: 'spring', stiffness: 90, damping: 20 }}
                className="h-full bg-emerald-500"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}