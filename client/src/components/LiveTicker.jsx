'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, Radio } from '@phosphor-icons/react';

/**
 * LiveTicker
 * Isolated client leaf for the scrolling attack feed.
 * Uses interval-driven state, not scroll physics, so it is intentionally
 * a plain useState loop rather than a Motion value (no continuous pointer input here).
 */

const FEED_SEED = [
  { tag: '#2PP0JVLU9', trophies: 5482, delta: 34, base: 'Hydra Hybrid v3' },
  { tag: '#Q0V8CYUL', trophies: 5391, delta: -28, base: 'Root Rider Sandwich' },
  { tag: '#8GYUL2QR', trophies: 5347, delta: 31, base: 'Super Witch Slap' },
  { tag: '#YV02JLPT', trophies: 5210, delta: -19, base: 'Hydra Hybrid v2' },
  { tag: '#RCQ9UYVL', trophies: 5188, delta: 27, base: 'Zap Quake E-Drag' },
  { tag: '#0LKPQY7J', trophies: 5104, delta: -22, base: 'Root Rider Freeze' },
];

export default function LiveTicker() {
  const [feed, setFeed] = useState(FEED_SEED);
  const indexRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % FEED_SEED.length;
      setFeed((prev) => {
        const rotated = [...prev];
        const item = rotated.shift();
        rotated.push({
          ...item,
          trophies: item.trophies + (Math.random() > 0.5 ? 3 : -3),
          delta: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 5 : -(Math.floor(Math.random() * 30) + 5),
        });
        return rotated;
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border border-slate-800 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2.5">
        <Radio size={14} weight="fill" className="text-emerald-500" strokeWidth={1.5} />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Live Legend Feed
        </span>
        <span className="ml-auto font-mono text-[11px] text-zinc-600">updates every 3.2s</span>
      </div>
      <div className="divide-y divide-slate-800">
        {feed.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-4 py-2.5 transition-colors duration-300 hover:bg-zinc-900/60"
          >
            <span className="font-mono text-xs text-zinc-500">{row.tag}</span>
            <span className="truncate text-sm text-zinc-300">{row.base}</span>
            <span className="font-mono text-sm text-zinc-100">{row.trophies.toLocaleString()}</span>
            <span
              className={`flex items-center gap-1 font-mono text-xs ${
                row.delta > 0 ? 'text-emerald-500' : 'text-zinc-500'
              }`}
            >
              {row.delta > 0 ? (
                <ArrowUp size={12} strokeWidth={1.5} />
              ) : (
                <ArrowDown size={12} strokeWidth={1.5} />
              )}
              {Math.abs(row.delta)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}