'use client';

import { useState } from 'react';

/**
 * MetaDistribution
 * Isolated leaf so hover-highlight state on bars does not force
 * the parent dashboard shell to be a client component.
 */

const META = [
  { name: 'Hydra Hybrid', share: 34.2, trend: 'up' },
  { name: 'Root Rider Sandwich', share: 22.8, trend: 'down' },
  { name: 'Super Witch Slap', share: 16.4, trend: 'up' },
  { name: 'Zap Quake E-Drag', share: 11.1, trend: 'flat' },
  { name: 'Loon Hound Freeze', share: 8.7, trend: 'down' },
  { name: 'Other', share: 6.8, trend: 'flat' },
];

export default function MetaDistribution() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="space-y-3">
      {META.map((item, i) => (
        <div
          key={item.name}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          className="group"
        >
          <div className="mb-1 flex items-baseline justify-between">
            <span
              className={`text-sm transition-colors ${
                hovered === i ? 'text-zinc-100' : 'text-zinc-400'
              }`}
            >
              {item.name}
            </span>
            <span className="font-mono text-xs text-zinc-500">{item.share}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900">
            <div
              style={{ width: `${item.share * 2.5}%` }}
              className={`h-full transition-all duration-300 ${
                hovered === i ? 'bg-emerald-400' : 'bg-emerald-600/70'
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}