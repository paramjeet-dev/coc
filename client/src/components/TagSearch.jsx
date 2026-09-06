'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MagnifyingGlass, ArrowRight, CircleNotch, User } from '@phosphor-icons/react';
import { searchPlayers } from '../lib/clashking';

/**
 * TagSearch
 * Debounced live search against GET /v2/player/search.
 * No mock results; empty/loading/error states are explicit.
 */
export default function TagSearch({ onSelectPlayer }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchPlayers(query, { signal: controller.signal });
        setResults(res.items ?? []);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Search failed. Try again.');
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [value]);

  const showDropdown = focused && value.trim().length >= 2;

  return (
    <div className="relative">
      <form
        onSubmit={(e) => e.preventDefault()}
        className={`flex items-center gap-3 border bg-zinc-950 px-4 py-3 transition-colors duration-200 ${
          focused ? 'border-emerald-500/60' : 'border-slate-800'
        }`}
      >
        <MagnifyingGlass size={18} strokeWidth={1.5} className="shrink-0 text-zinc-500" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search by tag or name"
          className="w-full bg-transparent font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
        />
        {loading && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            className="shrink-0 text-zinc-500"
          >
            <CircleNotch size={16} strokeWidth={1.5} />
          </motion.span>
        )}
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1.5 bg-emerald-500 px-3 py-1.5 font-mono text-xs font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
        >
          Pull
          <ArrowRight size={14} strokeWidth={1.5} />
        </button>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-1 w-full border border-slate-800 bg-zinc-950 shadow-xl shadow-black/40"
          >
            {error && <div className="px-4 py-3 text-sm text-zinc-500">{error}</div>}
            {!error && !loading && results.length === 0 && (
              <div className="px-4 py-3 text-sm text-zinc-600">No players found.</div>
            )}
            {!error &&
              results.map((player) => (
                <button
                  key={player.tag}
                  onMouseDown={() => onSelectPlayer?.(player)}
                  className="flex w-full items-center gap-3 border-b border-slate-800 px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-zinc-900"
                >
                  <User size={14} strokeWidth={1.5} className="shrink-0 text-zinc-600" />
                  <span className="flex-1 truncate text-sm text-zinc-200">{player.name}</span>
                  <span className="font-mono text-xs text-zinc-500">{player.tag}</span>
                  {player.townHallLevel != null && (
                    <span className="font-mono text-xs text-emerald-500">
                      TH{player.townHallLevel}
                    </span>
                  )}
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}