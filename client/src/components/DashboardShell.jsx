'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Sword, ChartBar } from '@phosphor-icons/react';
import TagSearch from './TagSearch';
import MetaDistribution from './MetaDistribution';
import LiveTicker from './LiveTicker';
import GlobalStatRail from './GlobalStatRail';

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

/**
 * DashboardShell
 * Holds the one piece of real cross-component state this page needs:
 * the selected player, which supplies a clan tag to LiveTicker.
 * Everything else fetches independently from real ClashKing endpoints.
 */
export default function DashboardShell() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  return (
    <div className="min-h-[100dvh] bg-zinc-950">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
          <motion.div
            initial={{ rotate: -8, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="flex h-8 w-8 items-center justify-center border border-emerald-500/40 bg-emerald-500/10"
          >
            <Sword size={16} strokeWidth={1.5} className="text-emerald-500" />
          </motion.div>
          <span className="font-mono text-sm font-medium tracking-tight text-zinc-100">
            CoC Legend Sync
          </span>
          <nav className="ml-auto hidden items-center gap-6 md:flex">
            <span className="text-sm text-zinc-500 transition-colors hover:text-zinc-200">
              Dashboard
            </span>
            <span className="text-sm text-zinc-500 transition-colors hover:text-zinc-200">
              War Log
            </span>
            <span className="text-sm text-zinc-500 transition-colors hover:text-zinc-200">
              Meta
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-zinc-100 md:text-4xl">
            Legend League command center
          </h1>
          <p className="mt-2 max-w-[60ch] text-sm text-zinc-500">
            Live trophy movement, attack meta, and clan activity pulled straight from ClashKing.
          </p>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }} className="mb-6">
          <TagSearch onSelectPlayer={setSelectedPlayer} />
          {selectedPlayer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 flex items-center gap-2 overflow-hidden font-mono text-xs text-zinc-500"
            >
              <span className="text-emerald-500">Tracking</span>
              {selectedPlayer.name} ({selectedPlayer.tag})
              {selectedPlayer.clan?.tag && <span>· {selectedPlayer.clan.name}</span>}
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-px bg-slate-800 lg:grid-cols-[2fr_1fr]">
          <motion.section
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-zinc-950 p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <ChartBar size={16} strokeWidth={1.5} className="text-emerald-500" />
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
                Attack meta distribution
              </h2>
            </div>
            <MetaDistribution />
          </motion.section>

          <motion.aside
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-zinc-950"
          >
            <GlobalStatRail />
          </motion.aside>
        </div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }} className="mt-6">
          <LiveTicker clanTag={selectedPlayer?.clan?.tag} />
        </motion.div>
      </main>
    </div>
  );
}