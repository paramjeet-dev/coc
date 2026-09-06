'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Radio, WarningCircle, SignIn, SignOut } from '@phosphor-icons/react';
import { getClanJoinLeave } from '../lib/clashking';
import { usePolledFetch } from '../lib/usePolledFetch';

/**
 * LiveTicker
 * When a clan tag is known, shows real join/leave events from
 * GET /v2/clan/{clan_tag}/join-leave polled on an interval.
 * With no clan selected, shows an explicit prompt instead of fake rows.
 */
export default function LiveTicker({ clanTag }) {
  const { data, error, loading } = usePolledFetch(
    ({ signal }) => (clanTag ? getClanJoinLeave(clanTag, 10, { signal }) : Promise.resolve(null)),
    [clanTag],
    clanTag ? 15000 : null
  );

  return (
    <div className="border border-slate-800 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2.5">
        <motion.span
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Radio size={14} weight="fill" className="text-emerald-500" strokeWidth={1.5} />
        </motion.span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Clan Activity Feed
        </span>
        {clanTag && (
          <span className="ml-auto font-mono text-[11px] text-zinc-600">{clanTag}</span>
        )}
      </div>

      {!clanTag && (
        <div className="px-4 py-6 text-center text-sm text-zinc-600">
          Search for a player above and pick one with a clan to see live join and leave activity.
        </div>
      )}

      {clanTag && loading && (
        <div className="divide-y divide-slate-800">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse px-4 py-3">
              <div className="h-3 w-2/3 bg-zinc-900" />
            </div>
          ))}
        </div>
      )}

      {clanTag && error && (
        <div className="flex items-center gap-2 px-4 py-4 text-zinc-500">
          <WarningCircle size={16} strokeWidth={1.5} className="text-emerald-600" />
          <span className="text-sm">Could not load activity for this clan.</span>
        </div>
      )}

      {clanTag && !loading && !error && (data?.items?.length ?? 0) === 0 && (
        <div className="px-4 py-6 text-center text-sm text-zinc-600">
          No recent join or leave events tracked for this clan.
        </div>
      )}

      {clanTag && !loading && !error && (
        <div className="divide-y divide-slate-800">
          <AnimatePresence initial={false}>
            {(data?.items ?? []).map((event, i) => (
              <motion.div
                key={`${event.tag}-${event.time}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-2.5 transition-colors duration-300 hover:bg-zinc-900/60"
              >
                {event.type === 'join' ? (
                  <SignIn size={14} strokeWidth={1.5} className="text-emerald-500" />
                ) : (
                  <SignOut size={14} strokeWidth={1.5} className="text-zinc-600" />
                )}
                <span className="truncate text-sm text-zinc-300">
                  {event.name}
                  {event.townHallLevel != null && (
                    <span className="ml-2 font-mono text-xs text-zinc-600">
                      TH{event.townHallLevel}
                    </span>
                  )}
                </span>
                <span className="font-mono text-xs text-zinc-600">
                  {new Date(event.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}